import {
  Injectable,
  Inject,
  Logger,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from '../models/order.schema';
import { OrderStatus } from '../enums/order-status.enum';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  // ──────────── Cache Key Helpers ────────────

  private userOrdersCacheKey(userId: string): string {
    return `orders_user_${userId}`;
  }

  private orderByIdCacheKey(orderId: string): string {
    return `order_${orderId}`;
  }

  /** Invalidate all order-related cache entries for a user */
  private async invalidateUserOrdersCache(userId: string): Promise<void> {
    await this.cacheManager.del(this.userOrdersCacheKey(userId));
    this.logger.log(`Orders cache invalidated for user ${userId}`);
  }

  /** Invalidate cache for a specific order */
  private async invalidateOrderCache(orderId: string): Promise<void> {
    await this.cacheManager.del(this.orderByIdCacheKey(orderId));
  }

  // ──────────── Valid Status Transitions ────────────

  /**
   * Defines which status transitions are allowed.
   * pending → paid → shipped → delivered
   * pending → cancelled (only pending orders can be cancelled)
   */
  private readonly validTransitions: Record<string, OrderStatus[]> = {
    [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.CANCELLED],
    [OrderStatus.PAID]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
    [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
    [OrderStatus.DELIVERED]: [],
    [OrderStatus.CANCELLED]: [],
  };

  private isValidTransition(
    currentStatus: string,
    newStatus: OrderStatus,
  ): boolean {
    const allowed = this.validTransitions[currentStatus];
    return allowed ? allowed.includes(newStatus) : false;
  }

  // ──────────── CRUD Methods ────────────

  /** Create a new order (called from StripeService) */
  async createOrder(orderData: Partial<Order>): Promise<Order> {
    const order = new this.orderModel({
      ...orderData,
      status: orderData.status || OrderStatus.PENDING,
    });
    const savedOrder = await order.save();

    // Invalidate the user's orders list cache
    if (orderData.userId) {
      await this.invalidateUserOrdersCache(orderData.userId.toString());
    }

    return savedOrder;
  }

  /** Get all orders for a specific user (with caching & lean) */
  async getUserOrders(userId: string, status?: OrderStatus) {
    const cacheKey = `${this.userOrdersCacheKey(userId)}_s${status || 'all'}`;

    // Check cache first
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      this.logger.log(`Cache HIT for ${cacheKey}`);
      return cached;
    }
    this.logger.log(`Cache MISS for ${cacheKey}`);

    // Build query filter
    const filter: any = { userId };
    if (status) {
      filter.status = status;
    }

    const orders = await this.orderModel
      .find(filter)
      .sort({ createdAt: -1 })
      .lean();

    // Store in cache
    await this.cacheManager.set(cacheKey, orders);

    return orders;
  }

  /** Get a single order by ID (with caching & lean) */
  async getOrderById(orderId: string, userId: string) {
    const cacheKey = this.orderByIdCacheKey(orderId);

    // Check cache first
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      this.logger.log(`Cache HIT for ${cacheKey}`);
      return cached;
    }
    this.logger.log(`Cache MISS for ${cacheKey}`);

    const order = await this.orderModel.findById(orderId).lean();

    if (!order) {
      throw new NotFoundException(
        'Order not found: No order exists with this ID',
      );
    }

    // Ensure the user can only view their own orders
    if (order.userId.toString() !== userId) {
      throw new ForbiddenException(
        'Access denied: You can only view your own orders',
      );
    }

    // Store in cache
    await this.cacheManager.set(cacheKey, order);

    return order;
  }

  /** Cancel an order (only pending/paid orders can be cancelled) */
  async cancelOrder(orderId: string, userId: string) {
    const order = await this.orderModel.findById(orderId).lean();

    if (!order) {
      throw new NotFoundException(
        'Order not found: No order exists with this ID',
      );
    }

    // Ensure the user can only cancel their own orders
    if (order.userId.toString() !== userId) {
      throw new ForbiddenException(
        'Access denied: You can only cancel your own orders',
      );
    }

    // Check if the cancellation is a valid transition
    if (!this.isValidTransition(order.status, OrderStatus.CANCELLED)) {
      throw new BadRequestException(
        `Cannot cancel order: Order with status "${order.status}" cannot be cancelled. Only pending or paid orders can be cancelled.`,
      );
    }

    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(
        orderId,
        { status: OrderStatus.CANCELLED },
        { new: true },
      )
      .lean();

    // Invalidate caches
    await this.invalidateOrderCache(orderId);
    await this.invalidateUserOrdersCache(userId);

    return updatedOrder;
  }

  /** Update order status with transition validation (for admin/internal use) */
  async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    userId?: string,
  ) {
    const order = await this.orderModel.findById(orderId).lean();

    if (!order) {
      throw new NotFoundException(
        'Order not found: No order exists with this ID',
      );
    }

    // Validate status transition
    if (!this.isValidTransition(order.status, newStatus)) {
      throw new BadRequestException(
        `Invalid status transition: Cannot change order status from "${order.status}" to "${newStatus}"`,
      );
    }

    const updatedOrder = await this.orderModel
      .findByIdAndUpdate(orderId, { status: newStatus }, { new: true })
      .lean();

    // Invalidate caches
    await this.invalidateOrderCache(orderId);
    await this.invalidateUserOrdersCache(order.userId.toString());

    return updatedOrder;
  }

  /** Update order data (generic, used by StripeService) */
  async updateOrder(
    orderId: string,
    updateData: Partial<Order>,
  ): Promise<Order | null> {
    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true },
    );

    if (updatedOrder) {
      await this.invalidateOrderCache(orderId);
      await this.invalidateUserOrdersCache(updatedOrder.userId.toString());
    }

    return updatedOrder;
  }

  /** Find order by Stripe session ID (lean, read-only) */
  async findByStripeSessionId(sessionId: string) {
    return this.orderModel.findOne({ stripeSessionId: sessionId }).lean();
  }
}
