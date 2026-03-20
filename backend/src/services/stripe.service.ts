import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import {
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { OrderStatus } from '../enums/order-status.enum';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(
    private configService: ConfigService,
    private orderService: OrderService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY')!,
      {
        apiVersion: '2025-08-27.basil',
      },
    );
  }

  // ──────────── Checkout Session ────────────

  async createCheckoutSession(
    amount: number,
    currency: string,
    productId: string,
    quantity: number,
    userId: string,
  ): Promise<Stripe.Checkout.Session> {
    try {
      // 1. Create order in DB first with pending status
      const order = await this.orderService.createOrder({
        productId,
        amount,
        quantity,
        currency,
        status: OrderStatus.PENDING,
        userId,
      });

      // 2. Create Stripe checkout session
      const session = await this.stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: currency,
              product_data: {
                name: `Product Order`,
              },
              unit_amount: amount * 100, // Stripe expects amount in cents
            },
            quantity: quantity,
          },
        ],
        mode: 'payment',
        success_url:
          this.configService.get<string>('STRIPE_SUCCESS_URL') ||
          'http://localhost:4200/home',
        cancel_url:
          this.configService.get<string>('STRIPE_CANCEL_URL') ||
          'http://localhost:4200/cancel.html',
        metadata: {
          orderId: order._id.toString(), // Link Stripe session to our order
          productId: productId,
          userId: userId,
        },
      });

      // 3. Save the Stripe session ID on the order for reference
      await this.orderService.updateOrder(order._id.toString(), {
        stripeSessionId: session.id,
      });

      this.logger.log(
        `Checkout session ${session.id} created for order ${order._id}`,
      );

      return session;
    } catch (error) {
      this.logger.error('Error creating checkout session:', error);
      throw new InternalServerErrorException(
        'Failed to create checkout session',
      );
    }
  }

  // ──────────── Webhook Handler ────────────

  /**
   * Handles incoming Stripe webhook events.
   * Verifies the signature to ensure the request is genuinely from Stripe,
   * then processes the event (e.g., updating order status on payment success).
   */
  async handleWebhook(rawBody: Buffer, signature: string) {
    const webhookSecret = this.configService.get<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    let event: Stripe.Event;

    if (webhookSecret && webhookSecret !== 'whsec_your_webhook_signing_secret_here') {
      // Production mode: Verify the webhook signature for security
      try {
        event = this.stripe.webhooks.constructEvent(
          rawBody,
          signature,
          webhookSecret,
        );
      } catch (error) {
        this.logger.error(`Webhook signature verification failed: ${error.message}`);
        throw new BadRequestException(
          `Webhook signature verification failed: ${error.message}`,
        );
      }
    } else {
      // Dev mode: No webhook secret configured — skip signature verification
      this.logger.warn(
        '⚠️  STRIPE_WEBHOOK_SECRET not configured — skipping signature verification. Do NOT use this in production!',
      );
      try {
        event = JSON.parse(rawBody.toString()) as Stripe.Event;
      } catch (error) {
        throw new BadRequestException('Invalid webhook payload');
      }
    }

    this.logger.log(`Received Stripe webhook event: ${event.type}`);

    // 2. Handle specific event types
    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session,
        );
        break;

      case 'checkout.session.expired':
        await this.handleCheckoutSessionExpired(
          event.data.object as Stripe.Checkout.Session,
        );
        break;

      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
  }

  // ──────────── Event Handlers ────────────

  /**
   * Called when a checkout session is completed (payment successful).
   * Updates the order status from 'pending' → 'paid'.
   */
  private async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session,
  ) {
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      this.logger.warn(
        `checkout.session.completed event missing orderId in metadata. Session ID: ${session.id}`,
      );
      return;
    }

    this.logger.log(
      `Payment completed for order ${orderId}, session ${session.id}`,
    );

    try {
      await this.orderService.updateOrderStatus(orderId, OrderStatus.PAID);

      // Also store the payment intent ID on the order for refund capability
      if (session.payment_intent) {
        await this.orderService.updateOrder(orderId, {
          paymentIntentId: session.payment_intent as string,
        });
      }

      this.logger.log(`Order ${orderId} marked as PAID`);
    } catch (error) {
      this.logger.error(
        `Failed to update order ${orderId} after payment: ${error.message}`,
      );
    }
  }

  /**
   * Called when a checkout session expires (customer didn't complete payment).
   * Updates the order status from 'pending' → 'cancelled'.
   */
  private async handleCheckoutSessionExpired(
    session: Stripe.Checkout.Session,
  ) {
    const orderId = session.metadata?.orderId;

    if (!orderId) {
      this.logger.warn(
        `checkout.session.expired event missing orderId in metadata. Session ID: ${session.id}`,
      );
      return;
    }

    this.logger.log(
      `Checkout session expired for order ${orderId}, session ${session.id}`,
    );

    try {
      await this.orderService.updateOrderStatus(
        orderId,
        OrderStatus.CANCELLED,
      );
      this.logger.log(`Order ${orderId} marked as CANCELLED (session expired)`);
    } catch (error) {
      this.logger.error(
        `Failed to cancel order ${orderId} after session expiry: ${error.message}`,
      );
    }
  }
}
