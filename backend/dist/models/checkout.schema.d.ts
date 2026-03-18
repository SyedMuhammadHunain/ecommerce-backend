import { Types } from 'mongoose';
export declare class Checkout {
    userId: string;
    items: {
        productId: string;
        quantity: number;
        price: number;
    }[];
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    totalAmount: number;
    paymentStatus: string;
    createdAt: Date;
}
export declare const CheckoutSchema: import("mongoose").Schema<Checkout, import("mongoose").Model<Checkout, any, any, any, import("mongoose").Document<unknown, any, Checkout, any, {}> & Checkout & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Checkout, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Checkout>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<Checkout> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
