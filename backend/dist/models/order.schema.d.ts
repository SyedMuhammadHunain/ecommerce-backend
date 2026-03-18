import { Document, Types } from 'mongoose';
import { OrderStatus } from '../enums/order-status.enum';
export declare class Order extends Document {
    userId: string;
    productId: string;
    amount: number;
    stripeSessionId?: string;
    paymentIntentId?: string;
    status: OrderStatus;
    currency?: string;
    quantity?: number;
}
export declare const OrderSchema: import("mongoose").Schema<Order, import("mongoose").Model<Order, any, any, any, Document<unknown, any, Order, any, {}> & Order & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, Document<unknown, {}, import("mongoose").FlatRecord<Order>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Order> & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
}>;
