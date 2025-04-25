// src/modules/checkout/checkout.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CheckoutService } from 'src/services/checkout.service';
import { CheckoutController } from 'src/controllers/checkout.controller';
import { Checkout, CheckoutSchema } from 'src/models/checkout.schema';
import { AuthModule } from 'src/modules/auth.module';

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
