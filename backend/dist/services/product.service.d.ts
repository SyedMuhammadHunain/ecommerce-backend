import { Cache } from 'cache-manager';
import { Product } from '../models/product.schema';
import { Model } from 'mongoose';
import { ProductDto } from '../dtos/product.dto';
import { User } from '../models/user.schema';
import { UpdatedProductDto } from '../dtos/updatedProduct.dto';
export declare class ProductService {
    private productModel;
    private userModel;
    private cacheManager;
    private readonly logger;
    constructor(productModel: Model<Product>, userModel: Model<User>, cacheManager: Cache);
    private getAllCacheKey;
    private getByIdCacheKey;
    private invalidateProductCache;
    create(productDto: ProductDto, userId: string): Promise<Product>;
    getAll(userId?: string): Promise<Product[]>;
    getById(productId: string, userId?: string): Promise<Product>;
    deleteById(productId: string, userId: string): Promise<void>;
    update(productId: string, updatedProductDto: UpdatedProductDto, currentUserId: string): Promise<Product>;
}
