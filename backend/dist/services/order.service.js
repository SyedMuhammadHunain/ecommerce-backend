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
var OrderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_status_enum_1 = require("../enums/order-status.enum");
let OrderService = OrderService_1 = class OrderService {
    orderModel;
    cacheManager;
    logger = new common_1.Logger(OrderService_1.name);
    constructor(orderModel, cacheManager) {
        this.orderModel = orderModel;
        this.cacheManager = cacheManager;
    }
    userOrdersCacheKey(userId) {
        return `orders_user_${userId}`;
    }
    orderByIdCacheKey(orderId) {
        return `order_${orderId}`;
    }
    async invalidateUserOrdersCache(userId) {
        await this.cacheManager.del(`${this.userOrdersCacheKey(userId)}_sall`);
        await this.cacheManager.del(`${this.userOrdersCacheKey(userId)}_spending`);
        await this.cacheManager.del(`${this.userOrdersCacheKey(userId)}_spaid`);
        this.logger.log(`Orders cache invalidated for user ${userId}`);
    }
    async invalidateOrderCache(orderId) {
        await this.cacheManager.del(this.orderByIdCacheKey(orderId));
    }
    validTransitions = {
        [order_status_enum_1.OrderStatus.PENDING]: [order_status_enum_1.OrderStatus.PAID, order_status_enum_1.OrderStatus.CANCELLED],
        [order_status_enum_1.OrderStatus.PAID]: [order_status_enum_1.OrderStatus.SHIPPED, order_status_enum_1.OrderStatus.CANCELLED],
        [order_status_enum_1.OrderStatus.SHIPPED]: [order_status_enum_1.OrderStatus.DELIVERED],
        [order_status_enum_1.OrderStatus.DELIVERED]: [],
        [order_status_enum_1.OrderStatus.CANCELLED]: [],
    };
    isValidTransition(currentStatus, newStatus) {
        const allowed = this.validTransitions[currentStatus];
        return allowed ? allowed.includes(newStatus) : false;
    }
    async createOrder(orderData) {
        const order = new this.orderModel({
            ...orderData,
            status: orderData.status || order_status_enum_1.OrderStatus.PENDING,
        });
        const savedOrder = await order.save();
        if (orderData.userId) {
            await this.invalidateUserOrdersCache(orderData.userId.toString());
        }
        return savedOrder;
    }
    async getUserOrders(userId, status) {
        const cacheKey = `${this.userOrdersCacheKey(userId)}_s${status || 'all'}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            this.logger.log(`Cache HIT for ${cacheKey}`);
            return cached;
        }
        this.logger.log(`Cache MISS for ${cacheKey}`);
        const filter = { userId };
        if (status) {
            filter.status = status;
        }
        const orders = await this.orderModel
            .find(filter)
            .populate('productId', 'productName image price')
            .sort({ createdAt: -1 })
            .lean();
        await this.cacheManager.set(cacheKey, orders);
        return orders;
    }
    async getOrderById(orderId, userId) {
        const cacheKey = this.orderByIdCacheKey(orderId);
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            this.logger.log(`Cache HIT for ${cacheKey}`);
            return cached;
        }
        this.logger.log(`Cache MISS for ${cacheKey}`);
        const order = await this.orderModel.findById(orderId).lean();
        if (!order) {
            throw new common_1.NotFoundException('Order not found: No order exists with this ID');
        }
        if (order.userId.toString() !== userId) {
            throw new common_1.ForbiddenException('Access denied: You can only view your own orders');
        }
        await this.cacheManager.set(cacheKey, order);
        return order;
    }
    async cancelOrder(orderId, userId) {
        const order = await this.orderModel.findById(orderId).lean();
        if (!order) {
            throw new common_1.NotFoundException('Order not found: No order exists with this ID');
        }
        if (order.userId.toString() !== userId) {
            throw new common_1.ForbiddenException('Access denied: You can only cancel your own orders');
        }
        if (!this.isValidTransition(order.status, order_status_enum_1.OrderStatus.CANCELLED)) {
            throw new common_1.BadRequestException(`Cannot cancel order: Order with status "${order.status}" cannot be cancelled. Only pending or paid orders can be cancelled.`);
        }
        const updatedOrder = await this.orderModel
            .findByIdAndUpdate(orderId, { status: order_status_enum_1.OrderStatus.CANCELLED }, { new: true })
            .lean();
        await this.invalidateOrderCache(orderId);
        await this.invalidateUserOrdersCache(userId);
        return updatedOrder;
    }
    async updateOrderStatus(orderId, newStatus, userId) {
        const order = await this.orderModel.findById(orderId).lean();
        if (!order) {
            throw new common_1.NotFoundException('Order not found: No order exists with this ID');
        }
        if (!this.isValidTransition(order.status, newStatus)) {
            throw new common_1.BadRequestException(`Invalid status transition: Cannot change order status from "${order.status}" to "${newStatus}"`);
        }
        const updatedOrder = await this.orderModel
            .findByIdAndUpdate(orderId, { status: newStatus }, { new: true })
            .lean();
        await this.invalidateOrderCache(orderId);
        await this.invalidateUserOrdersCache(order.userId.toString());
        return updatedOrder;
    }
    async updateOrder(orderId, updateData) {
        const updatedOrder = await this.orderModel.findByIdAndUpdate(orderId, updateData, { new: true });
        if (updatedOrder) {
            await this.invalidateOrderCache(orderId);
            await this.invalidateUserOrdersCache(updatedOrder.userId.toString());
        }
        return updatedOrder;
    }
    async findByStripeSessionId(sessionId) {
        return this.orderModel.findOne({ stripeSessionId: sessionId }).lean();
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = OrderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Order')),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [mongoose_2.Model, Object])
], OrderService);
//# sourceMappingURL=order.service.js.map