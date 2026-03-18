// src/modules/checkout/checkout.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CheckoutService } from '../services/checkout.service';
import { CheckoutController } from '../controllers/checkout.controller';
import { Checkout, CheckoutSchema } from '../models/checkout.schema';
import { AuthModule } from '../modules/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Checkout.name, schema: CheckoutSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [CheckoutController],
  providers: [CheckoutService],
})
export class CheckoutModule {}
