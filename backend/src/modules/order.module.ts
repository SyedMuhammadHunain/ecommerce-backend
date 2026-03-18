import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSchema } from '../models/order.schema';
import { OrderService } from '../services/order.service';
import { OrderController } from '../controllers/order.controller';
import { JwtConfig } from '../config/jwt.config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    JwtConfig,
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule { }
