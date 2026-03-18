import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { EmailService } from '../services/email.service';
import { MailerConfig } from '../config/mailer.config';
import { UserModule } from '../modules/user.module';
import { JwtConfig } from '../config/jwt.config';
import { MongooseConfig } from '../config/mongoose.config';
import { RefreshConfig } from '../config/refresh-jwt.config';
import { JwtService } from '@nestjs/jwt';
import { ProductModule } from '../modules/product.module';
import { CartModule } from './cart.module';
import { CheckoutModule } from './checkout.module';
import { StripeModule } from '../modules/stripe.module';
import { OrderModule } from './order.module';

@Module({
  imports: [
    MongooseConfig,
    JwtConfig,
    MailerConfig,
    RefreshConfig,
    forwardRef(() => UserModule),
    forwardRef(() => ProductModule),
    CartModule,
    CheckoutModule,
    StripeModule,
    OrderModule,
  ],
  providers: [AuthService, EmailService, JwtService],
  controllers: [AuthController],
  exports: [AuthService, JwtService],
})
export class AuthModule {}
