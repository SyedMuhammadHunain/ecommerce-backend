"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const user_module_1 = require("./modules/user.module");
const auth_module_1 = require("./modules/auth.module");
const product_module_1 = require("./modules/product.module");
const core_1 = require("@nestjs/core");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const cart_module_1 = require("./modules/cart.module");
const checkout_module_1 = require("./modules/checkout.module");
const order_module_1 = require("./modules/order.module");
const stripe_module_1 = require("./modules/stripe.module");
const cache_manager_1 = require("@nestjs/cache-manager");
const throttler_1 = require("@nestjs/throttler");
const devtools_integration_1 = require("@nestjs/devtools-integration");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            devtools_integration_1.DevtoolsModule.register({
                http: process.env.NODE_ENV !== 'production',
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            throttler_1.ThrottlerModule.forRoot({
                throttlers: [
                    {
                        ttl: 60000,
                        limit: 10,
                    },
                ],
            }),
            cache_manager_1.CacheModule.register({
                isGlobal: true,
                ttl: 60000,
                max: 100,
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGODB_URI', ''),
                    maxPoolSize: 10,
                    minPoolSize: 4,
                    maxConnecting: 2,
                    maxIdleTimeMS: 30000,
                    serverSelectionTimeoutMS: 5000,
                    connectTimeoutMS: 10000,
                    socketTimeoutMS: 45000,
                    tls: true,
                    authSource: 'admin',
                    retryWrites: true,
                    retryReads: true,
                    heartbeatFrequencyMS: 10000,
                }),
                inject: [config_1.ConfigService],
            }),
            user_module_1.UserModule,
            auth_module_1.AuthModule,
            product_module_1.ProductModule,
            cart_module_1.CartModule,
            checkout_module_1.CheckoutModule,
            order_module_1.OrderModule,
            stripe_module_1.StripeModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.AuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map