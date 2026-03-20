// src/services/checkout.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Checkout } from '../models/checkout.schema';
import { CheckoutDto } from '../dtos/checkout.dto';
import { OrderService } from './order.service';
import { CartService } from './cart.service';
import { OrderStatus } from '../enums/order-status.enum';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CheckoutService {
  private stripe: Stripe;

  constructor(
    @InjectModel(Checkout.name) private readonly checkoutModel: Model<Checkout>,
    private readonly orderService: OrderService,
    private readonly cartService: CartService,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY')!,
      {
        apiVersion: '2025-08-27.basil' as any,
      },
    );
  }

  async createCheckout(checkoutDto: CheckoutDto, userId: string) {
    let totalAmount = 0;
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    const orderIds: string[] = [];

    // 1. Calculate amount, build line items and create individual orders
    for (const item of checkoutDto.items) {
      totalAmount += item.quantity * item.price;

      // Note: productId logic expects schema to accept it
      const order = await this.orderService.createOrder({
        productId: item.productId,
        amount: item.price,
        quantity: item.quantity,
        currency: 'usd',
        status: OrderStatus.PENDING,
        userId,
      });
      orderIds.push(order._id.toString());

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: `Product Order` },
          unit_amount: Math.round(item.price * 100), // cents
        },
        quantity: item.quantity,
      });
    }

    // 2. Save Checkout Record
    const createdCheckout = new this.checkoutModel({
      userId,
      items: checkoutDto.items,
      shippingAddress: checkoutDto.shippingAddress,
      totalAmount,
      paymentStatus: 'pending',
      createdAt: new Date(),
    });
    const savedCheckout = await createdCheckout.save();

    // 3. Clear Backend Cart State
    try {
      await this.cartService.clearCart(userId);
    } catch(e) {} // best effort

    // 4. Create Stripe Session
    try {
      const session = await this.stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: this.configService.get<string>('STRIPE_SUCCESS_URL') || `http://localhost:4200/home?clearCart=true`,
        cancel_url: this.configService.get<string>('STRIPE_CANCEL_URL') || 'http://localhost:4200/cancel.html',
        metadata: {
          checkoutId: savedCheckout._id.toString(),
          userId: userId,
          orderIds: JSON.stringify(orderIds),
        },
      });

      return {
        message: 'Checkout created successfully',
        checkout: savedCheckout,
        url: session.url
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create checkout session: ' + error.message);
    }
  }
}

