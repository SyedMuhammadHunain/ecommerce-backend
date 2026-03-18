import { Model } from 'mongoose';
import { Checkout } from '../models/checkout.schema';
import { CheckoutDto } from '../dtos/checkout.dto';
export declare class CheckoutService {
    private readonly checkoutModel;
    constructor(checkoutModel: Model<Checkout>);
    createCheckout(checkoutDto: CheckoutDto, userId: string): Promise<{
        message: string;
        checkout: import("mongoose").Document<unknown, {}, Checkout, {}, {}> & Checkout & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
}
