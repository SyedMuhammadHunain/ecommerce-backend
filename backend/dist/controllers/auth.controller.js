"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const signup_dto_1 = require("../dtos/signup.dto");
const auth_service_1 = require("../services/auth.service");
const login_dto_1 = require("../dtos/login.dto");
const email_service_1 = require("../services/email.service");
const user_service_1 = require("../services/user.service");
const resendOtp_dto_1 = require("../dtos/resendOtp.dto");
const refreshToken_dto_1 = require("../dtos/refreshToken.dto");
const forgot_password_dto_1 = require("../dtos/forgot-password.dto");
const reset_password_dto_1 = require("../dtos/reset-password.dto");
const public_decorators_1 = require("../common/decorators/public.decorators");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
let AuthController = class AuthController {
    authService;
    emailService;
    userService;
    constructor(authService, emailService, userService) {
        this.authService = authService;
        this.emailService = emailService;
        this.userService = userService;
    }
    async signUp(signUpDto) {
        const user = await this.userService.createUser(signUpDto);
        await this.emailService.sendEmail(signUpDto.email);
        return {
            message: 'Signed Up',
        };
    }
    async login(logInDto) {
        return this.authService.login(logInDto);
    }
    async resendOtp(resendOtpDto) {
        return this.emailService.resendOtp(resendOtpDto);
    }
    async forgotPassword(forgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto);
    }
    async refreshToken(refreshTokenDto) {
        try {
            return await this.authService.refreshToken(refreshTokenDto);
        }
        catch (error) {
            throw new common_1.UnauthorizedException(error.message);
        }
    }
    async passwordResetLink(token, resetPasswordDto) {
        console.log(resetPasswordDto);
        return this.authService.passwordUpdate(token, resetPasswordDto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, public_decorators_1.Public)(),
    (0, common_1.Post)('/signUp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signup_dto_1.SignUpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUp", null);
__decorate([
    (0, public_decorators_1.Public)(),
    (0, common_1.Post)('/login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, public_decorators_1.Public)(),
    (0, common_1.Post)('/resend-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resendOtp_dto_1.ResendOtpDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resendOtp", null);
__decorate([
    (0, public_decorators_1.Public)(),
    (0, common_1.Post)('/forgot-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forgot_password_dto_1.ForgotPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, public_decorators_1.Public)(),
    (0, common_1.Post)('/refresh-token'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [refreshToken_dto_1.RefreshTokenDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, public_decorators_1.Public)(),
    (0, common_1.Patch)('/reset-password/:token'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reset_password_dto_1.ResetPasswordDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "passwordResetLink", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.AuthGuard),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        email_service_1.EmailService,
        user_service_1.UserService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map