import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartController } from '../controllers/cart.controller';
import { CartService } from '../services/cart.service';
import { Cart, CartSchema } from '../models/cart.schema';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
  ],
  controllers: [CartController],
  providers: [CartService, JwtService],
  exports: [CartService],
})
export class CartModule {}
