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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutSchema = exports.Checkout = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let Checkout = class Checkout {
    userId;
    items;
    shippingAddress;
    totalAmount;
    paymentStatus;
    createdAt;
};
exports.Checkout = Checkout;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Checkout.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                productId: { type: String, required: true },
                quantity: { type: Number, required: true, min: 1 },
                price: { type: Number, required: true, min: 0 },
            },
        ],
        required: true,
    }),
    __metadata("design:type", Array)
], Checkout.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zip: { type: String, required: true },
            country: { type: String, required: true },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], Checkout.prototype, "shippingAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], Checkout.prototype, "totalAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    }),
    __metadata("design:type", String)
], Checkout.prototype, "paymentStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Checkout.prototype, "createdAt", void 0);
exports.Checkout = Checkout = __decorate([
    (0, mongoose_1.Schema)()
], Checkout);
exports.CheckoutSchema = mongoose_1.SchemaFactory.createForClass(Checkout);
//# sourceMappingURL=checkout.schema.js.map