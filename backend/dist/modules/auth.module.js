"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_service_1 = require("../services/auth.service");
const email_service_1 = require("../services/email.service");
const mailer_config_1 = require("../config/mailer.config");
const user_module_1 = require("../modules/user.module");
const jwt_config_1 = require("../config/jwt.config");
const mongoose_config_1 = require("../config/mongoose.config");
const refresh_jwt_config_1 = require("../config/refresh-jwt.config");
const jwt_1 = require("@nestjs/jwt");
const product_module_1 = require("../modules/product.module");
const cart_module_1 = require("./cart.module");
const checkout_module_1 = require("./checkout.module");
const stripe_module_1 = require("../modules/stripe.module");
const order_module_1 = require("./order.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_config_1.MongooseConfig,
            jwt_config_1.JwtConfig,
            mailer_config_1.MailerConfig,
            refresh_jwt_config_1.RefreshConfig,
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
            (0, common_1.forwardRef)(() => product_module_1.ProductModule),
            cart_module_1.CartModule,
            checkout_module_1.CheckoutModule,
            stripe_module_1.StripeModule,
            order_module_1.OrderModule,
        ],
        providers: [auth_service_1.AuthService, email_service_1.EmailService, jwt_1.JwtService],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService, jwt_1.JwtService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map