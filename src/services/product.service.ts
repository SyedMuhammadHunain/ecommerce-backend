import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'src/models/product.schema';
import { Model } from 'mongoose';
import { ProductDto } from 'src/dtos/product.dto';
// import { UpdatedProductDto } from 'src/dtos/updatedProduct.dto';
import { User } from 'src/models/user.schema';
import { Roles } from 'src/enums/roles.enums';
import { Types } from 'mongoose';
import { UpdatedProductDto } from 'src/dtos/updatedProduct.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

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
    return product.save();
  }

  async getAll(userId: string): Promise<Product[]> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(
        'Account not found: User profile does not exist',
      );
    }

    if (user.role === Roles.SELLER) {
      return await this.productModel.find({ seller: user._id });
    } else if (user.role === Roles.CUSTOMER) {
      return await this.productModel.find();
    }
    return [];
  }

  async getById(productId: string, userId: string): Promise<Product> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(
        'Account not found: User profile does not exist',
      );
    }

    if (user.role === Roles.SELLER) {
      const product = await this.productModel.findById(productId);
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
      return product;
    } else if (user.role === Roles.CUSTOMER) {
      const product = await this.productModel.findById(productId);
      if (!product) {
        throw new NotFoundException(
          'Product not found: Item does not exist in catalog',
        );
      }
      return product;
    }
    throw new UnauthorizedException(
      'Access denied: Insufficient permissions to view product details',
    );
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
    return updatedProduct;
  }
}
