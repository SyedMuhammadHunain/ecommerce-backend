import { CheckoutService } from '../services/checkout.service';
import { CheckoutDto } from '../dtos/checkout.dto';
import { CustomRequest } from '../interfaces/request.interface';
export declare class CheckoutController {
    private readonly checkoutService;
    constructor(checkoutService: CheckoutService);
    createCheckout(checkoutDto: CheckoutDto, req: CustomRequest): Promise<{
        message: string;
        checkout: import("mongoose").Document<unknown, {}, import("../models/checkout.schema").Checkout, {}, {}> & import("../models/checkout.schema").Checkout & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
        url: string | null;
    }>;
}
