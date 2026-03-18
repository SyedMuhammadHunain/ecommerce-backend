// src/services/checkout.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Checkout } from '../models/checkout.schema';
import { CheckoutDto } from '../dtos/checkout.dto';

@Injectable()
export class CheckoutService {
  constructor(
    @InjectModel(Checkout.name) private readonly checkoutModel: Model<Checkout>,
  ) {}

  async createCheckout(checkoutDto: CheckoutDto, userId: string) {
    let totalAmount = 0;

    checkoutDto.items.forEach((item) => {
      totalAmount += item.quantity * item.price;
    });

    const createdCheckout = new this.checkoutModel({
      userId,
      items: checkoutDto.items,
      shippingAddress: checkoutDto.shippingAddress,
      totalAmount,
      paymentStatus: 'pending',
      createdAt: new Date(),
    });

    const savedCheckout = await createdCheckout.save();

    return {
      message: 'Checkout created successfully',
      checkout: savedCheckout,
    };
  }
}
