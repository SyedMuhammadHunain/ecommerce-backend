import { Module } from '@nestjs/common';
import { JwtConfig } from 'src/config/jwt.config';
import { StripeController } from 'src/controllers/stripe.controller';
import { OrderModule } from 'src/modules/order.module';
import { StripeService } from 'src/services/stripe.service';

@Module({
  imports: [OrderModule, JwtConfig],
  controllers: [StripeController],
  providers: [StripeService],
})
export class StripeModule {}
