import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { Order } from '../models/order.schema';
import { OrderStatus } from '../enums/order-status.enum';
export declare class OrderService {
    private readonly orderModel;
    private cacheManager;
    private readonly logger;
    constructor(orderModel: Model<Order>, cacheManager: Cache);
    private userOrdersCacheKey;
    private orderByIdCacheKey;
    private invalidateUserOrdersCache;
    private invalidateOrderCache;
    private readonly validTransitions;
    private isValidTransition;
    createOrder(orderData: Partial<Order>): Promise<Order>;
    getUserOrders(userId: string, status?: OrderStatus): Promise<{}>;
    getOrderById(orderId: string, userId: string): Promise<{}>;
    cancelOrder(orderId: string, userId: string): Promise<(import("mongoose").FlattenMaps<Order> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    updateOrderStatus(orderId: string, newStatus: OrderStatus, userId?: string): Promise<(import("mongoose").FlattenMaps<Order> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    updateOrder(orderId: string, updateData: Partial<Order>): Promise<Order | null>;
    findByStripeSessionId(sessionId: string): Promise<(import("mongoose").FlattenMaps<Order> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
