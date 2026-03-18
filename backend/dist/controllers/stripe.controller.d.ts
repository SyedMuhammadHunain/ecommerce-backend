import { RawBodyRequest } from '@nestjs/common';
import { CustomRequest } from '../interfaces/request.interface';
import { StripeService } from '../services/stripe.service';
import Stripe from 'stripe';
import { Request } from 'express';
export declare class StripeController {
    private readonly stripeService;
    constructor(stripeService: StripeService);
    createCheckoutSession(body: {
        amount: number;
        currency: string;
        productId: string;
        quantity: number;
    }, req: CustomRequest): Promise<Stripe.Checkout.Session>;
    handleWebhook(req: RawBodyRequest<Request>, signature: string): Promise<{
        received: boolean;
    }>;
}
