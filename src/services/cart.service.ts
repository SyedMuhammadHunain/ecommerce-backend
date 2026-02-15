// src/services/cart.service.ts
import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from '../models/cart.schema';

@Injectable()
export class CartService {
  private readonly logger = new Logger(CartService.name);

  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  private cartCacheKey(userId: string): string {
    return `cart_${userId}`;
  }

  async addToCart(userId: string, productId: string, quantity: number = 1): Promise<Cart> {
    const objectUserId = new Types.ObjectId(userId);
    const objectProductId = new Types.ObjectId(productId);

    let cart = await this.cartModel.findOne({ userId: objectUserId });

    if (!cart) {
      cart = await this.cartModel.create({
        userId: objectUserId,
        items: [{ productId: objectProductId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId.toString() === productId,
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId: objectProductId, quantity });
      }

      await cart.save();
    }

    // Invalidate cart cache after modification
    await this.cacheManager.del(this.cartCacheKey(userId));
    this.logger.log(`Cart cache invalidated for user ${userId}`);

    return cart;
  }

  async getCart(userId: string): Promise<Cart | null> {
    const cacheKey = this.cartCacheKey(userId);

    // Check cache first
    const cached = await this.cacheManager.get<Cart | null>(cacheKey);
    if (cached !== undefined && cached !== null) {
      this.logger.log(`Cache HIT for ${cacheKey}`);
      return cached;
    }
    this.logger.log(`Cache MISS for ${cacheKey}`);

    const cart = await this.cartModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .populate('items.productId');

    // Store in cache (even null so we don't keep querying)
    await this.cacheManager.set(cacheKey, cart);

    return cart;
  }
}
