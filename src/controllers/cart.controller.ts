// src/controllers/cart.controller.ts
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CartService } from '../services/cart.service';
import { AddToCartDto } from '../dtos/addToCart.dto';
import { AuthGuard } from '../common/guards/jwt-auth.guard';
import { Cart } from '../models/cart.schema';
import { CustomRequest } from '../interfaces/request.interface';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @UseGuards(AuthGuard)
  @Post('add-to-cart')
  addToCart(
    @Req() req: CustomRequest,
    @Body() body: AddToCartDto,
  ): Promise<Cart> {
    const userId = req.user.sub;
    const { productId, quantity } = body;
    return this.cartService.addToCart(userId, productId, quantity);
  }

  @UseGuards(AuthGuard)
  @Get()
  getCart(@Req() req: CustomRequest): Promise<Cart | null> {
    const userId = req.user.sub;
    return this.cartService.getCart(userId);
  }
}
