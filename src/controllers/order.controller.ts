import {
    Controller,
    Get,
    Patch,
    Param,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { AuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CustomRequest } from '../interfaces/request.interface';
import { OrderStatus } from '../enums/order-status.enum';

@Controller('orders')
@UseGuards(AuthGuard, RolesGuard)
export class OrderController {
    constructor(private readonly orderService: OrderService) { }

    /**
     * GET /orders
     * Get all orders for the authenticated user.
     * Supports optional status filter.
     *
     * Query params:
     *   - status (optional: pending | paid | shipped | delivered | cancelled)
     */
    @Get()
    @Roles('customer', 'seller', 'admin')
    getUserOrders(
        @Req() req: CustomRequest,
        @Query('status') status?: OrderStatus,
    ) {
        const userId = req.user.sub;
        return this.orderService.getUserOrders(userId, status);
    }

    /**
     * GET /orders/:id
     * Get details of a specific order by ID.
     * User can only view their own orders.
     */
    @Get(':id')
    @Roles('customer', 'seller', 'admin')
    getOrderById(@Param('id') orderId: string, @Req() req: CustomRequest) {
        const userId = req.user.sub;
        return this.orderService.getOrderById(orderId, userId);
    }

    /**
     * PATCH /orders/:id/cancel
     * Cancel a pending or paid order.
     * Only the order owner can cancel.
     */
    @Patch(':id/cancel')
    @Roles('customer', 'seller')
    cancelOrder(@Param('id') orderId: string, @Req() req: CustomRequest) {
        const userId = req.user.sub;
        return this.orderService.cancelOrder(orderId, userId);
    }

    /**
     * PATCH /orders/:id/status
     * Update order status (admin only).
     * Validates status transitions.
     *
     * Query params:
     *   - status (required: paid | shipped | delivered | cancelled)
     */
    @Patch(':id/status')
    @Roles('admin')
    updateOrderStatus(
        @Param('id') orderId: string,
        @Query('status') status: OrderStatus,
        @Req() req: CustomRequest,
    ) {
        const userId = req.user.sub;
        return this.orderService.updateOrderStatus(orderId, status, userId);
    }
}
