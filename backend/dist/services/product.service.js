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
var ProductService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const mongoose_1 = require("@nestjs/mongoose");
const product_schema_1 = require("../models/product.schema");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../models/user.schema");
const roles_enums_1 = require("../enums/roles.enums");
const mongoose_3 = require("mongoose");
let ProductService = ProductService_1 = class ProductService {
    productModel;
    userModel;
    cacheManager;
    logger = new common_1.Logger(ProductService_1.name);
    constructor(productModel, userModel, cacheManager) {
        this.productModel = productModel;
        this.userModel = userModel;
        this.cacheManager = cacheManager;
    }
    getAllCacheKey(userId) {
        return `products_all_${userId}`;
    }
    getByIdCacheKey(productId, userId) {
        return `product_${productId}_${userId}`;
    }
    async invalidateProductCache(userId) {
        await this.cacheManager.del(this.getAllCacheKey(userId));
        this.logger.log(`Cache invalidated for user ${userId}`);
    }
    async create(productDto, userId) {
        const user = await this.userModel.findById(userId).lean();
        if (!user) {
            throw new common_1.NotFoundException('Account not found: User profile does not exist');
        }
        if (user.role !== roles_enums_1.Roles.SELLER) {
            throw new common_1.ForbiddenException('Only sellers can create products');
        }
        const product = new this.productModel({
            ...productDto,
            userId: new mongoose_3.Types.ObjectId(userId),
        });
        const savedProduct = await product.save();
        await this.invalidateProductCache(userId);
        return savedProduct;
    }
    async getAll(userId) {
        const cacheKey = this.getAllCacheKey(userId);
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            this.logger.log(`Cache HIT for ${cacheKey}`);
            return cached;
        }
        this.logger.log(`Cache MISS for ${cacheKey}`);
        const user = await this.userModel.findById(userId).lean();
        if (!user) {
            throw new common_1.NotFoundException('Account not found: User profile does not exist');
        }
        let products = [];
        if (user.role === roles_enums_1.Roles.SELLER) {
            products = await this.productModel.find({ userId: user._id }).lean();
        }
        else if (user.role === roles_enums_1.Roles.CUSTOMER) {
            products = await this.productModel.find().lean();
        }
        await this.cacheManager.set(cacheKey, products);
        return products;
    }
    async getById(productId, userId) {
        const cacheKey = this.getByIdCacheKey(productId, userId);
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            this.logger.log(`Cache HIT for ${cacheKey}`);
            return cached;
        }
        this.logger.log(`Cache MISS for ${cacheKey}`);
        const user = await this.userModel.findById(userId).lean();
        if (!user) {
            throw new common_1.NotFoundException('Account not found: User profile does not exist');
        }
        let product = null;
        if (user.role === roles_enums_1.Roles.SELLER) {
            product = await this.productModel.findById(productId).lean();
            if (!product) {
                throw new common_1.NotFoundException('Product not found: Item does not exist in catalog');
            }
            if (!product.userId || String(product.userId) !== userId) {
                throw new common_1.UnauthorizedException('Access denied: You can only view your own product listings');
            }
        }
        else if (user.role === roles_enums_1.Roles.CUSTOMER) {
            product = await this.productModel.findById(productId).lean();
            if (!product) {
                throw new common_1.NotFoundException('Product not found: Item does not exist in catalog');
            }
        }
        else {
            throw new common_1.UnauthorizedException('Access denied: Insufficient permissions to view product details');
        }
        await this.cacheManager.set(cacheKey, product);
        return product;
    }
    async deleteById(productId, userId) {
        const user = await this.userModel.findById(userId).lean();
        if (!user) {
            throw new common_1.NotFoundException('Account not found: User profile does not exist');
        }
        if (user.role !== roles_enums_1.Roles.SELLER) {
            throw new common_1.ForbiddenException('Only sellers can delete products');
        }
        const product = await this.productModel.findById(productId).lean();
        if (!product) {
            throw new common_1.NotFoundException('Product not found: Item does not exist in catalog');
        }
        if (!product.userId || String(product.userId) !== userId) {
            throw new common_1.UnauthorizedException('Access denied: You can only delete your own product listings');
        }
        await this.productModel.findByIdAndDelete(productId).exec();
        await this.invalidateProductCache(userId);
        await this.cacheManager.del(this.getByIdCacheKey(productId, userId));
    }
    async update(productId, updatedProductDto, currentUserId) {
        const user = await this.userModel.findById(currentUserId).lean();
        if (!user) {
            throw new common_1.NotFoundException('Account not found: User profile does not exist');
        }
        if (user.role !== roles_enums_1.Roles.SELLER) {
            throw new common_1.UnauthorizedException('Access denied: Seller verification required to update products');
        }
        const product = await this.productModel.findById(productId).lean();
        if (!product) {
            throw new common_1.NotFoundException('Product not found: Item does not exist in catalog');
        }
        if (!product.userId) {
            throw new common_1.UnauthorizedException('Access denied: You can only update your own product listings');
        }
        const updatedProduct = await this.productModel.findByIdAndUpdate(productId, updatedProductDto, { new: true });
        if (!updatedProduct) {
            throw new common_1.NotFoundException('Operation failed: Product could not be updated in catalog');
        }
        await this.invalidateProductCache(currentUserId);
        await this.cacheManager.del(this.getByIdCacheKey(productId, currentUserId));
        return updatedProduct;
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = ProductService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model, Object])
], ProductService);
//# sourceMappingURL=product.service.js.map