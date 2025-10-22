import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from 'src/modules/user.module';
import { AuthModule } from 'src/modules/auth.module';
import { ProductModule } from 'src/modules/product.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CartModule } from 'src/modules/cart.module';
import { CheckoutModule } from 'src/modules/checkout.module';
import { OrderModule } from 'src/modules/order.module';
import { StripeModule } from 'src/modules/stripe.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI', ''),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    ProductModule,
    CartModule,
    CheckoutModule,
    OrderModule,
    StripeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
