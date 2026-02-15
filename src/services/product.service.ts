import {
  Injectable,
  Inject,
  Logger,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from '../models/product.schema';
import { Model } from 'mongoose';
import { ProductDto } from '../dtos/product.dto';
import { User } from '../models/user.schema';
import { Roles } from '../enums/roles.enums';
import { Types } from 'mongoose';
import { UpdatedProductDto } from '../dtos/updatedProduct.dto';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  // ──────────── Cache Key Helpers ────────────
  private getAllCacheKey(userId: string): string {
    return `products_all_${userId}`;
  }

  private getByIdCacheKey(productId: string, userId: string): string {
    return `product_${productId}_${userId}`;
  }

  /** Invalidate all product-related cache entries for a user */
  private async invalidateProductCache(userId: string): Promise<void> {
    await this.cacheManager.del(this.getAllCacheKey(userId));
    this.logger.log(`Cache invalidated for user ${userId}`);
  }

  // ──────────── CRUD Methods ────────────

  async create(productDto: ProductDto, userId: string): Promise<Product> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(
        'Account not found: User profile does not exist',
      );
    }
    if (user.role !== Roles.SELLER) {
      throw new ForbiddenException('Only sellers can create products');
    }

    const product = new this.productModel({
      ...productDto,
      userId: new Types.ObjectId(userId),
    });
    const savedProduct = await product.save();

    // Invalidate the "all products" cache for this seller
    await this.invalidateProductCache(userId);

    return savedProduct;
  }

  async getAll(userId: string): Promise<Product[]> {
    const cacheKey = this.getAllCacheKey(userId);

    // Check cache first
    const cached = await this.cacheManager.get<Product[]>(cacheKey);
    if (cached) {
      this.logger.log(`Cache HIT for ${cacheKey}`);
      return cached;
    }
    this.logger.log(`Cache MISS for ${cacheKey}`);

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(
        'Account not found: User profile does not exist',
      );
    }

    let products: Product[] = [];
    if (user.role === Roles.SELLER) {
      products = await this.productModel.find({ seller: user._id });
    } else if (user.role === Roles.CUSTOMER) {
      products = await this.productModel.find();
    }

    // Store in cache
    await this.cacheManager.set(cacheKey, products);

    return products;
  }

  async getById(productId: string, userId: string): Promise<Product> {
    const cacheKey = this.getByIdCacheKey(productId, userId);

    // Check cache first
    const cached = await this.cacheManager.get<Product>(cacheKey);
    if (cached) {
      this.logger.log(`Cache HIT for ${cacheKey}`);
      return cached;
    }
    this.logger.log(`Cache MISS for ${cacheKey}`);

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(
        'Account not found: User profile does not exist',
      );
    }

    let product: Product | null = null;

    if (user.role === Roles.SELLER) {
      product = await this.productModel.findById(productId);
      if (!product) {
        throw new NotFoundException(
          'Product not found: Item does not exist in catalog',
        );
      }
      if (!product.userId || String(product.userId) !== userId) {
        throw new UnauthorizedException(
          'Access denied: You can only view your own product listings',
        );
      }
    } else if (user.role === Roles.CUSTOMER) {
      product = await this.productModel.findById(productId);
      if (!product) {
        throw new NotFoundException(
          'Product not found: Item does not exist in catalog',
        );
      }
    } else {
      throw new UnauthorizedException(
        'Access denied: Insufficient permissions to view product details',
      );
    }

    // Store in cache
    await this.cacheManager.set(cacheKey, product);

    return product;
  }

  async deleteById(productId: string, userId: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(
        'Account not found: User profile does not exist',
      );
    }
    if (user.role !== Roles.SELLER) {
      throw new ForbiddenException('Only sellers can delete products');
    }

    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException(
        'Product not found: Item does not exist in catalog',
      );
    }
    if (!product.userId || String(product.userId) !== userId) {
      throw new UnauthorizedException(
        'Access denied: You can only delete your own product listings',
      );
    }

    await this.productModel.findByIdAndDelete(productId).exec();

    // Invalidate caches
    await this.invalidateProductCache(userId);
    await this.cacheManager.del(this.getByIdCacheKey(productId, userId));
  }

  async update(
    productId: string,
    updatedProductDto: UpdatedProductDto,
    currentUserId: string,
  ): Promise<Product> {
    const user = await this.userModel.findById(currentUserId);
    if (!user) {
      throw new NotFoundException(
        'Account not found: User profile does not exist',
      );
    }
    if (user.role !== Roles.SELLER) {
      throw new UnauthorizedException(
        'Access denied: Seller verification required to update products',
      );
    }

    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException(
        'Product not found: Item does not exist in catalog',
      );
    }
    if (!product.userId) {
      throw new UnauthorizedException(
        'Access denied: You can only update your own product listings',
      );
    }

    const updatedProduct = await this.productModel.findByIdAndUpdate(
      productId,
      updatedProductDto,
      { new: true },
    );
    if (!updatedProduct) {
      throw new NotFoundException(
        'Operation failed: Product could not be updated in catalog',
      );
    }

    // Invalidate caches
    await this.invalidateProductCache(currentUserId);
    await this.cacheManager.del(this.getByIdCacheKey(productId, currentUserId));

    return updatedProduct;
  }
}
