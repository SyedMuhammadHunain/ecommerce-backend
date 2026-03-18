import { Cache } from 'cache-manager';
import { Model, Types } from 'mongoose';
import { Cart } from '../models/cart.schema';
export declare class CartService {
    private cartModel;
    private cacheManager;
    private readonly logger;
    constructor(cartModel: Model<Cart>, cacheManager: Cache);
    private cartCacheKey;
    addToCart(userId: string, productId: string, quantity?: number): Promise<Cart>;
    getCart(userId: string): Promise<Cart | (import("mongoose").FlattenMaps<Cart> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
