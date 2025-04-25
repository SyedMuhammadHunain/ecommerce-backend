import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from 'src/models/order.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
  ) {}

  // Create order in the database
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const order = new this.orderModel({
      ...orderData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await order.save();
  }

  async updateOrder(
    orderId: string,
    updateData: Partial<Order>,
  ): Promise<Order | null> {
    return this.orderModel.findByIdAndUpdate(orderId, updateData, {
      new: true,
    });
  }

  // Find order by Stripe session ID
  async findByStripeSessionId(sessionId: string): Promise<Order | null> {
    return this.orderModel.findOne({ stripeSessionId: sessionId });
  }
}
