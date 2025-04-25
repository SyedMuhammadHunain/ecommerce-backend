import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { InternalServerErrorException } from '@nestjs/common';
import { OrderService } from 'src/services/order.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(private configService: ConfigService, private orderService: OrderService) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY')!,
      {
        apiVersion: '2025-03-31.basil',
      },
    );
  }

  async createCheckoutSession(
    amount: number,
    currency: string,
    productId: string, // Product ID can be used for better data management
    quantity: number,
    userId: string,
  ): Promise<Stripe.Checkout.Session> {
    try {
      // 👇 Create order before session
      const order = await this.orderService.createOrder({
        productId,
        amount,
        quantity,
        currency,
        status: 'pending', // optional field,
        userId,
      });

      const session = await this.stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: currency,
              product_data: {
                name: `Test Product`, // You can customize the product name as needed
                // Additional product information can be added here
              },
              unit_amount: amount * 100, // Amount is in cents
            },
            quantity: quantity, // Specify the quantity of the product
          },
        ],
        mode: 'payment', // Set the mode to 'payment'
        success_url: `http://localhost:4242/success.html`, // Redirect URL on success
        cancel_url: `http://localhost:4242/cancel.html`, // Redirect URL on cancellation
        metadata: {
          // Pass any additional data here, such as user ID
          // or product ID for handling in webhooks
          productId: productId,
        },
      });

      return session; // Return the created session
    } catch (error) {
      console.error('Error creating session:', error);
      throw new InternalServerErrorException(
        'Failed to create checkout session', // Handle errors gracefully
      );
    }
  }
}
