// src/modules/checkout/checkout.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CheckoutService } from '../services/checkout.service';
import { CheckoutController } from '../controllers/checkout.controller';
import { Checkout, CheckoutSchema } from '../models/checkout.schema';
import { AuthModule } from '../modules/auth.module';
import { OrderModule } from './order.module';
import { CartModule } from './cart.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Checkout.name, schema: CheckoutSchema },
    ]),
    forwardRef(() => AuthModule),
    OrderModule,
    CartModule,
    ConfigModule,
  ],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}
