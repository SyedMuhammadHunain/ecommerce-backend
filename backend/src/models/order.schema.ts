import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OrderStatus } from '../enums/order-status.enum';

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: string;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ index: true })
  stripeSessionId?: string;

  @Prop()
  paymentIntentId?: string;

  @Prop({
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
    index: true,
  })
  status: OrderStatus;

  @Prop({ default: 'usd' })
  currency?: string;

  @Prop({ min: 1, default: 1 })
  quantity?: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
