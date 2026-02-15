import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './modules/user.module';
import { AuthModule } from './modules/auth.module';
import { ProductModule } from './modules/product.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/jwt-auth.guard';
import { CartModule } from './modules/cart.module';
import { CheckoutModule } from './modules/checkout.module';
import { OrderModule } from './modules/order.module';
import { StripeModule } from './modules/stripe.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60000, // 60 seconds default TTL
      max: 100, // Maximum number of items in cache
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI', ''),

        // Connection Pool
        maxPoolSize: 10,              // Max connections in the pool
        minPoolSize: 4,              // Keep at least 2 connections warm
        maxConnecting: 2,            // Max connections being established at once
        maxIdleTimeMS: 30000,        // Close idle connections after 30s

        // Timeouts
        serverSelectionTimeoutMS: 5000,  // Fail fast if no server found
        connectTimeoutMS: 10000,         // Timeout for initial connection
        socketTimeoutMS: 45000,          // Timeout for socket inactivity

        // Security
        tls: true,                   // Enforce TLS/SSL encryption
        authSource: 'admin',         // Authenticate against admin DB

        // Resilience
        retryWrites: true,           // Auto-retry failed writes
        retryReads: true,            // Auto-retry failed reads
        heartbeatFrequencyMS: 10000, // Check connection health every 10s
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
export class AppModule { }
