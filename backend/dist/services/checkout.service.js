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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const checkout_schema_1 = require("../models/checkout.schema");
const order_service_1 = require("./order.service");
const cart_service_1 = require("./cart.service");
const order_status_enum_1 = require("../enums/order-status.enum");
const stripe_1 = require("stripe");
const config_1 = require("@nestjs/config");
let CheckoutService = class CheckoutService {
    checkoutModel;
    orderService;
    cartService;
    configService;
    stripe;
    constructor(checkoutModel, orderService, cartService, configService) {
        this.checkoutModel = checkoutModel;
        this.orderService = orderService;
        this.cartService = cartService;
        this.configService = configService;
        this.stripe = new stripe_1.default(this.configService.get('STRIPE_SECRET_KEY'), {
            apiVersion: '2025-08-27.basil',
        });
    }
    async createCheckout(checkoutDto, userId) {
        let totalAmount = 0;
        const lineItems = [];
        const orderIds = [];
        for (const item of checkoutDto.items) {
            totalAmount += item.quantity * item.price;
            const order = await this.orderService.createOrder({
                productId: item.productId,
                amount: item.price,
                quantity: item.quantity,
                currency: 'usd',
                status: order_status_enum_1.OrderStatus.PENDING,
                userId,
            });
            orderIds.push(order._id.toString());
            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: { name: `Product Order` },
                    unit_amount: Math.round(item.price * 100),
                },
                quantity: item.quantity,
            });
        }
        const createdCheckout = new this.checkoutModel({
            userId,
            items: checkoutDto.items,
            shippingAddress: checkoutDto.shippingAddress,
            totalAmount,
            paymentStatus: 'pending',
            createdAt: new Date(),
        });
        const savedCheckout = await createdCheckout.save();
        try {
            await this.cartService.clearCart(userId);
        }
        catch (e) { }
        try {
            const session = await this.stripe.checkout.sessions.create({
                line_items: lineItems,
                mode: 'payment',
                success_url: this.configService.get('STRIPE_SUCCESS_URL') || `http://localhost:4200/home?clearCart=true`,
                cancel_url: this.configService.get('STRIPE_CANCEL_URL') || 'http://localhost:4200/cancel.html',
                metadata: {
                    checkoutId: savedCheckout._id.toString(),
                    userId: userId,
                    orderIds: JSON.stringify(orderIds),
                },
            });
            return {
                message: 'Checkout created successfully',
                checkout: savedCheckout,
                url: session.url
            };
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to create checkout session: ' + error.message);
        }
    }
};
exports.CheckoutService = CheckoutService;
exports.CheckoutService = CheckoutService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(checkout_schema_1.Checkout.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        order_service_1.OrderService,
        cart_service_1.CartService,
        config_1.ConfigService])
], CheckoutService);
//# sourceMappingURL=checkout.service.js.map