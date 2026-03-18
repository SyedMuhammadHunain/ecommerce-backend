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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
const bcrypt = require("bcrypt");
const email_service_1 = require("../services/email.service");
const jwt_1 = require("@nestjs/jwt");
const common_2 = require("@nestjs/common");
let AuthService = class AuthService {
    userModel;
    authModel;
    emailService;
    jwtService;
    constructor(userModel, authModel, emailService, jwtService) {
        this.userModel = userModel;
        this.authModel = authModel;
        this.emailService = emailService;
        this.jwtService = jwtService;
    }
    async login(logInDto) {
        const { email, password } = logInDto;
        const foundUser = await this.userModel.findOne({ email }).lean().exec();
        if (!foundUser) {
            throw new common_1.UnauthorizedException('Authentication failed: Invalid email or password');
        }
        const isMatch = await bcrypt.compare(password, foundUser.password);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Authentication failed: Invalid email or password');
        }
        const isValidOtp = await this.emailService.isValidOtp(logInDto);
        if (!isValidOtp) {
            throw new common_1.UnauthorizedException('Authentication failed: Invalid verification code');
        }
        const updatedUser = await this.userModel.findByIdAndUpdate(foundUser._id, { isVerified: true }, { new: true });
        if (!updatedUser) {
            throw new common_1.UnauthorizedException('User not found after verification update');
        }
        const accessToken = await this.generateToken(updatedUser);
        const refreshToken = await this.generateRefreshToken(updatedUser);
        return { accessToken, refreshToken };
    }
    async generateToken(user) {
        const payload = {
            sub: user._id.toString(),
            email: user.email,
            role: user.role,
            isVerified: user.isVerified,
        };
        return this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
    }
    async generateRefreshToken(user) {
        const payload = {
            sub: user._id.toString(),
            email: user.email,
            isVerified: user.isVerified,
            role: user.role,
        };
        const refreshToken = this.jwtService.sign(payload, {
            secret: process.env.REFRESH_JWT_SECRET,
            expiresIn: process.env.REFRESH_JWT_EXPIRES_IN,
        });
        const saltRounds = 11;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedRt = await bcrypt.hash(refreshToken, salt);
        await this.userModel.updateOne({ email: user.email }, { $set: { hashedRefreshToken: hashedRt } });
        return refreshToken;
    }
    async refreshToken(refreshTokenDto) {
        const { refreshToken } = refreshTokenDto;
        try {
            const decoded = await this.jwtService.verify(refreshToken, {
                secret: process.env.REFRESH_JWT_SECRET,
            });
            const user = await this.userModel
                .findById(decoded.sub)
                .select('+hashedRefreshToken')
                .exec();
            if (!user) {
                throw new common_1.UnauthorizedException('Authentication failed: User account not found');
            }
            const isValidRefreshToken = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
            if (!isValidRefreshToken) {
                throw new common_1.UnauthorizedException('Authentication failed: Invalid refresh token');
            }
            const accessToken = await this.generateToken(user);
            return { accessToken };
        }
        catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new common_1.UnauthorizedException('Session expired: Please login again to continue');
            }
            throw new common_1.UnauthorizedException('Authentication failed: Invalid refresh token');
        }
    }
    async forgotPassword(forgotPasswordDto) {
        const { email } = forgotPasswordDto;
        const user = await this.userModel.findOne({ email }).lean();
        if (!user) {
            throw new common_2.NotFoundException('Account not found: No user registered with this email');
        }
        const passwordResetToken = await this.generatePasswordResetToken();
        await this.userModel.updateOne({ email }, { $set: { passwordResetToken } });
        const passwordResetLink = await this.emailService.passwordResetEmail(email, passwordResetToken);
        return { passwordResetLink };
    }
    async generatePasswordResetToken() {
        const cryptoRandomString = (await Promise.resolve().then(() => require('crypto-random-string'))).default;
        const resetToken = cryptoRandomString({ length: 30, type: 'alphanumeric' });
        return resetToken;
    }
    async passwordUpdate(token, resetPasswordDto) {
        const users = await this.userModel
            .find({ passwordResetToken: { $exists: true } })
            .select('+passwordResetToken +passwordResetTokenExpiresAt +hashedRefreshToken')
            .lean();
        let matchedUser = null;
        for (const user of users) {
            if (user.passwordResetToken === token) {
                matchedUser = user;
                break;
            }
        }
        if (!matchedUser) {
            throw new common_1.UnauthorizedException('Password reset failed: Invalid or expired reset token');
        }
        const now = new Date();
        if (matchedUser.passwordResetTokenExpiresAt &&
            matchedUser.passwordResetTokenExpiresAt < now) {
            throw new common_1.UnauthorizedException('Password reset failed: Reset token has expired. Please request a new one');
        }
        const { newPassword } = resetPasswordDto;
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        await this.userModel.updateOne({ _id: matchedUser._id }, {
            $set: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetTokenExpiresAt: null,
            },
        });
        return { message: 'Password successfully updated' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)('User')),
    __param(1, (0, mongoose_2.InjectModel)('AuthCollections')),
    __metadata("design:paramtypes", [mongoose_1.Model,
        mongoose_1.Model,
        email_service_1.EmailService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map