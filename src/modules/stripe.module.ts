import { Module } from '@nestjs/common';
import { JwtConfig } from '../config/jwt.config';
import { StripeController } from '../controllers/stripe.controller';
import { OrderModule } from '../modules/order.module';
import { StripeService } from '../services/stripe.service';

@Module({
  imports: [OrderModule, JwtConfig],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}
