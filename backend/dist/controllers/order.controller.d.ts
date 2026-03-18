import { OrderService } from '../services/order.service';
import { CustomRequest } from '../interfaces/request.interface';
import { OrderStatus } from '../enums/order-status.enum';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    getUserOrders(req: CustomRequest, status?: OrderStatus): Promise<{}>;
    getOrderById(orderId: string, req: CustomRequest): Promise<{}>;
    cancelOrder(orderId: string, req: CustomRequest): Promise<(import("mongoose").FlattenMaps<import("../models/order.schema").Order> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    updateOrderStatus(orderId: string, status: OrderStatus, req: CustomRequest): Promise<(import("mongoose").FlattenMaps<import("../models/order.schema").Order> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
