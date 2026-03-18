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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mailer_1 = require("@nestjs-modules/mailer");
let EmailService = EmailService_1 = class EmailService {
    authCollections;
    mailerService;
    logger = new common_1.Logger(EmailService_1.name);
    constructor(authCollections, mailerService) {
        this.authCollections = authCollections;
        this.mailerService = mailerService;
        setInterval(() => this.cleanupExpiredOtps(), 600000);
    }
    async cleanupExpiredOtps() {
        try {
            await this.authCollections.deleteMany({
                expiresAt: { $lt: new Date() },
            });
        }
        catch (error) {
            this.logger.error('Failed to cleanup expired OTPs:', error);
        }
    }
    generateOtpCode() {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        return { otp };
    }
    async sendEmail(email) {
        const { otp } = this.generateOtpCode();
        await this.authCollections.create({
            email,
            code: otp,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 600000),
        });
        await this.emailSend(otp, email);
    }
    async resendOtp(resendOtpDto) {
        const { otp } = this.generateOtpCode();
        const { email } = resendOtpDto;
        await this.authCollections.findOneAndUpdate({ email }, {
            code: otp,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 600000),
        }, { upsert: true, new: true });
        await this.emailSend(otp, email);
    }
    async emailSend(otp, email) {
        await this.mailerService.sendMail({
            to: email,
            from: 'noreply@example.com',
            subject: 'Your Verification Code',
            text: `Your verification code is: ${otp}. This code will expire in 10 minutes. Please do not share it with anyone.`,
        });
    }
    async isValidOtp(loginDto) {
        const { email, code } = loginDto;
        const found = await this.authCollections.findOne({ email }).lean().exec();
        if (!found) {
            throw new common_1.UnauthorizedException('Cannot find OTP code for this email');
        }
        const { expiresAt } = found;
        if (expiresAt < new Date()) {
            await this.authCollections.deleteOne({ email }).exec();
            throw new common_1.UnauthorizedException('OTP code expired. Please request a new one.');
        }
        if (code !== found.code) {
            throw new common_1.UnauthorizedException('Invalid OTP code');
        }
        await this.authCollections.deleteOne({ email }).exec();
        return true;
    }
    async passwordResetEmail(email, passwordResetToken) {
        const passwordResetLink = `http://localhost:3000/reset-password/${passwordResetToken}`;
        await this.mailerService.sendMail({
            to: email,
            from: 'noreply@example.com',
            subject: 'Your Verification Code',
            text: `Click the link to reset your password: ${passwordResetLink}`,
        });
        return passwordResetLink;
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('AuthCollections')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mailer_1.MailerService])
], EmailService);
//# sourceMappingURL=email.service.js.map