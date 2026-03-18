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
exports.StripeController = void 0;
const common_1 = require("@nestjs/common");
const roles_guard_1 = require("../common/guards/roles.guard");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const stripe_service_1 = require("../services/stripe.service");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const public_decorators_1 = require("../common/decorators/public.decorators");
let StripeController = class StripeController {
    stripeService;
    constructor(stripeService) {
        this.stripeService = stripeService;
    }
    async createCheckoutSession(body, req) {
        const { amount, currency, productId, quantity } = body;
        const userId = req.user.sub;
        return this.stripeService.createCheckoutSession(amount, currency, productId, quantity, userId);
    }
    async handleWebhook(req, signature) {
        return this.stripeService.handleWebhook(req.rawBody, signature);
    }
};
exports.StripeController = StripeController;
__decorate([
    (0, roles_decorator_1.Roles)('customer'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard),
    (0, common_1.Post)('create-checkout-session'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "createCheckoutSession", null);
__decorate([
    (0, public_decorators_1.Public)(),
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)('stripe-signature')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StripeController.prototype, "handleWebhook", null);
exports.StripeController = StripeController = __decorate([
    (0, common_1.Controller)('payment'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [stripe_service_1.StripeService])
], StripeController);
//# sourceMappingURL=stripe.controller.js.map