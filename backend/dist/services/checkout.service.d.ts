import { Model } from 'mongoose';
import { Checkout } from '../models/checkout.schema';
import { CheckoutDto } from '../dtos/checkout.dto';
import { OrderService } from './order.service';
import { CartService } from './cart.service';
import { ConfigService } from '@nestjs/config';
export declare class CheckoutService {
    private readonly checkoutModel;
    private readonly orderService;
    private readonly cartService;
    private readonly configService;
    private stripe;
    constructor(checkoutModel: Model<Checkout>, orderService: OrderService, cartService: CartService, configService: ConfigService);
    createCheckout(checkoutDto: CheckoutDto, userId: string): Promise<{
        message: string;
        checkout: import("mongoose").Document<unknown, {}, Checkout, {}, {}> & Checkout & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
        url: string | null;
    }>;
}
