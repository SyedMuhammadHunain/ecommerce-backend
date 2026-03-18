"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var StripeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const stripe_1 = require("stripe");
const config_1 = require("@nestjs/config");
const common_2 = require("@nestjs/common");
const order_service_1 = require("../services/order.service");
const order_status_enum_1 = require("../enums/order-status.enum");
let StripeService = StripeService_1 = class StripeService {
    configService;
    orderService;
    stripe;
    logger = new common_1.Logger(StripeService_1.name);
    constructor(configService, orderService) {
        this.configService = configService;
        this.orderService = orderService;
        this.stripe = new stripe_1.default(this.configService.get('STRIPE_SECRET_KEY'), {
            apiVersion: '2025-08-27.basil',
        });
    }
    async createCheckoutSession(amount, currency, productId, quantity, userId) {
        try {
            const order = await this.orderService.createOrder({
                productId,
                amount,
                quantity,
                currency,
                status: order_status_enum_1.OrderStatus.PENDING,
                userId,
            });
            const session = await this.stripe.checkout.sessions.create({
                line_items: [
                    {
                        price_data: {
                            currency: currency,
                            product_data: {
                                name: `Product Order`,
                            },
                            unit_amount: amount * 100,
                        },
                        quantity: quantity,
                    },
                ],
                mode: 'payment',
                success_url: this.configService.get('STRIPE_SUCCESS_URL') ||
                    'http://localhost:4242/success.html',
                cancel_url: this.configService.get('STRIPE_CANCEL_URL') ||
                    'http://localhost:4242/cancel.html',
                metadata: {
                    orderId: order._id.toString(),
                    productId: productId,
                    userId: userId,
                },
            });
            await this.orderService.updateOrder(order._id.toString(), {
                stripeSessionId: session.id,
            });
            this.logger.log(`Checkout session ${session.id} created for order ${order._id}`);
            return session;
        }
        catch (error) {
            this.logger.error('Error creating checkout session:', error);
            throw new common_2.InternalServerErrorException('Failed to create checkout session');
        }
    }
    async handleWebhook(rawBody, signature) {
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        let event;
        if (webhookSecret && webhookSecret !== 'whsec_your_webhook_signing_secret_here') {
            try {
                event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
            }
            catch (error) {
                this.logger.error(`Webhook signature verification failed: ${error.message}`);
                throw new common_2.BadRequestException(`Webhook signature verification failed: ${error.message}`);
            }
        }
        else {
            this.logger.warn('⚠️  STRIPE_WEBHOOK_SECRET not configured — skipping signature verification. Do NOT use this in production!');
            try {
                event = JSON.parse(rawBody.toString());
            }
            catch (error) {
                throw new common_2.BadRequestException('Invalid webhook payload');
            }
        }
        this.logger.log(`Received Stripe webhook event: ${event.type}`);
        switch (event.type) {
            case 'checkout.session.completed':
                await this.handleCheckoutSessionCompleted(event.data.object);
                break;
            case 'checkout.session.expired':
                await this.handleCheckoutSessionExpired(event.data.object);
                break;
            default:
                this.logger.log(`Unhandled event type: ${event.type}`);
        }
        return { received: true };
    }
    async handleCheckoutSessionCompleted(session) {
        const orderId = session.metadata?.orderId;
        if (!orderId) {
            this.logger.warn(`checkout.session.completed event missing orderId in metadata. Session ID: ${session.id}`);
            return;
        }
        this.logger.log(`Payment completed for order ${orderId}, session ${session.id}`);
        try {
            await this.orderService.updateOrderStatus(orderId, order_status_enum_1.OrderStatus.PAID);
            if (session.payment_intent) {
                await this.orderService.updateOrder(orderId, {
                    paymentIntentId: session.payment_intent,
                });
            }
            this.logger.log(`Order ${orderId} marked as PAID`);
        }
        catch (error) {
            this.logger.error(`Failed to update order ${orderId} after payment: ${error.message}`);
        }
    }
    async handleCheckoutSessionExpired(session) {
        const orderId = session.metadata?.orderId;
        if (!orderId) {
            this.logger.warn(`checkout.session.expired event missing orderId in metadata. Session ID: ${session.id}`);
            return;
        }
        this.logger.log(`Checkout session expired for order ${orderId}, session ${session.id}`);
        try {
            await this.orderService.updateOrderStatus(orderId, order_status_enum_1.OrderStatus.CANCELLED);
            this.logger.log(`Order ${orderId} marked as CANCELLED (session expired)`);
        }
        catch (error) {
            this.logger.error(`Failed to cancel order ${orderId} after session expiry: ${error.message}`);
        }
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = StripeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        order_service_1.OrderService])
], StripeService);
//# sourceMappingURL=stripe.service.js.map