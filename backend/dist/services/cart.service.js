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
var CartService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cart_schema_1 = require("../models/cart.schema");
let CartService = CartService_1 = class CartService {
    cartModel;
    cacheManager;
    logger = new common_1.Logger(CartService_1.name);
    constructor(cartModel, cacheManager) {
        this.cartModel = cartModel;
        this.cacheManager = cacheManager;
    }
    cartCacheKey(userId) {
        return `cart_${userId}`;
    }
    async addToCart(userId, productId, quantity = 1) {
        const objectUserId = new mongoose_2.Types.ObjectId(userId);
        const objectProductId = new mongoose_2.Types.ObjectId(productId);
        let cart = await this.cartModel.findOne({ userId: objectUserId });
        if (!cart) {
            cart = await this.cartModel.create({
                userId: objectUserId,
                items: [{ productId: objectProductId, quantity }],
            });
        }
        else {
            const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            }
            else {
                cart.items.push({ productId: objectProductId, quantity });
            }
            await cart.save();
        }
        await this.cacheManager.del(this.cartCacheKey(userId));
        this.logger.log(`Cart cache invalidated for user ${userId}`);
        return cart;
    }
    async getCart(userId) {
        const cacheKey = this.cartCacheKey(userId);
        const cached = await this.cacheManager.get(cacheKey);
        if (cached !== undefined && cached !== null) {
            this.logger.log(`Cache HIT for ${cacheKey}`);
            return cached;
        }
        this.logger.log(`Cache MISS for ${cacheKey}`);
        const cart = await this.cartModel
            .findOne({ userId: new mongoose_2.Types.ObjectId(userId) })
            .populate('items.productId')
            .lean();
        await this.cacheManager.set(cacheKey, cart);
        return cart;
    }
};
exports.CartService = CartService;
exports.CartService = CartService = CartService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cart_schema_1.Cart.name)),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [mongoose_2.Model, Object])
], CartService);
//# sourceMappingURL=cart.service.js.map