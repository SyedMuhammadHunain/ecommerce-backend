import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class Order extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  amount: number;

  @Prop()
  stripeSessionId?: string;

  @Prop()
  paymentIntentId?: string;

  @Prop({ enum: ['pending', 'completed'], default: 'pending' })
  status: string;

  @Prop()
  currency?: string;

  @Prop()
  quantity?: number;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updatedAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
