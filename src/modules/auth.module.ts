import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from 'src/controllers/auth.controller';
import { AuthService } from 'src/services/auth.service';
import { EmailService } from 'src/services/email.service';
import { MailerConfig } from 'src/config/mailer.config';
import { UserModule } from 'src/modules/user.module';
import { JwtConfig } from 'src/config/jwt.config';
import { MongooseConfig } from 'src/config/mongoose.config';
import { RefreshConfig } from 'src/config/refresh-jwt.config';
import { JwtService } from '@nestjs/jwt';
import { ProductModule } from 'src/modules/product.module';
import { CartModule } from './cart.module';
import { CheckoutModule } from './checkout.module';
import { StripeModule } from 'src/modules/stripe.module';
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
