// src/schemas/checkout.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Checkout {
  @Prop({ required: true })
  userId: string;

  @Prop({
    type: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    required: true,
  })
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];

  @Prop({
    type: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, required: true },
    },
    required: true,
  })
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };

  @Prop({ required: true, min: 0 })
  totalAmount: number;

  @Prop({
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  })
  paymentStatus: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const CheckoutSchema = SchemaFactory.createForClass(Checkout);
