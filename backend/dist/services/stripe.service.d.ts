import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { OrderService } from '../services/order.service';
export declare class StripeService {
    private configService;
    private orderService;
    private stripe;
    private readonly logger;
    constructor(configService: ConfigService, orderService: OrderService);
    createCheckoutSession(amount: number, currency: string, productId: string, quantity: number, userId: string): Promise<Stripe.Checkout.Session>;
    handleWebhook(rawBody: Buffer, signature: string): Promise<{
        received: boolean;
    }>;
    private handleCheckoutSessionCompleted;
    private handleCheckoutSessionExpired;
}
