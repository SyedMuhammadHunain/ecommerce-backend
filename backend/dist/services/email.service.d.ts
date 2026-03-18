import { Model } from 'mongoose';
import { Auth } from '../models/auth.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { ResendOtpDto } from '../dtos/resendOtp.dto';
import { LoginDto } from '../dtos/login.dto';
export declare class EmailService {
    private authCollections;
    private readonly mailerService;
    private readonly logger;
    constructor(authCollections: Model<Auth>, mailerService: MailerService);
    private cleanupExpiredOtps;
    generateOtpCode(): {
        otp: string;
    };
    sendEmail(email: string): Promise<void>;
    resendOtp(resendOtpDto: ResendOtpDto): Promise<void>;
    emailSend(otp: string, email: string): Promise<void>;
    isValidOtp(loginDto: LoginDto): Promise<boolean>;
    passwordResetEmail(email: string, passwordResetToken: string): Promise<string>;
}
