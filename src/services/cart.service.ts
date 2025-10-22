// src/services/cart.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from '../models/cart.schema';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<Cart>) {}

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

    return cart;
  }

  async getCart(userId: string): Promise<Cart | null> {
    return this.cartModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .populate('items.productId');
  }
}
