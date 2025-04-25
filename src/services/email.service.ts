import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Auth } from 'src/models/auth.schema';
import { MailerService } from '@nestjs-modules/mailer';
import { authenticator } from 'otplib';
import { ResendOtpDto } from 'src/dtos/resendOtp.dto';
import { LoginDto } from 'src/dtos/login.dto';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @InjectModel('AuthCollections') private authCollections: Model<Auth>,
    private readonly mailerService: MailerService,
  ) /*           ChatGPT             */
  {
    // Clean up expired OTPs periodically
    setInterval(() => this.cleanupExpiredOtps(), 600000); // Run every 10 minutes
  }

  private async cleanupExpiredOtps() {
    try {
      await this.authCollections.deleteMany({
        expiresAt: { $lt: new Date() },
      });
    } catch (error) {
      this.logger.error('Failed to cleanup expired OTPs:', error);
    }
  }
  /*           ChatGPT             */
  generateOtpCode() {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    return { otp };
  }

  async sendEmail(email: string) {
    const { otp } = this.generateOtpCode();

    // Create a new OTP document in the database
    await this.authCollections.create({
      email,
      code: otp,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 600000), // 10 minutes
    });

    await this.emailSend(otp, email);
  }

  async resendOtp(resendOtpDto: ResendOtpDto) {
    const { otp } = this.generateOtpCode();
    const { email } = resendOtpDto;

    // Update or create OTP document
    await this.authCollections.findOneAndUpdate(
      { email },
      {
        code: otp,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 600000),
      },
      { upsert: true, new: true },
    );

    await this.emailSend(otp, email);
  }

  // Send email to the user
  async emailSend(otp: string, email: string) {
    await this.mailerService.sendMail({
      to: email,
      from: 'noreply@example.com',
      subject: 'Your Verification Code',
      text: `Your verification code is: ${otp}. This code will expire in 10 minutes. Please do not share it with anyone.`,
    });
  }

  async isValidOtp(loginDto: LoginDto) {
    const { email, code } = loginDto;

    const found = await this.authCollections.findOne({ email }).exec();
    if (!found) {
      throw new UnauthorizedException('Cannot find OTP code for this email');
    }

    const { expiresAt } = found;

    // First check if otp is expired
    if (expiresAt < new Date()) {
      await this.authCollections.deleteOne({ email }).exec();
      throw new UnauthorizedException(
        'OTP code expired. Please request a new one.',
      );
    }

    // Check if the entered OTP matches the stored OTP
    if (code !== found.code) {
      throw new UnauthorizedException('Invalid OTP code');
    }

    // Delete the OTP after successful verification
    await this.authCollections.deleteOne({ email }).exec();

    return true;
  }

  // Send email to the user for password reset
  async passwordResetEmail(email: string, passwordResetToken: string) {
    const passwordResetLink = `http://localhost:3000/reset-password/${passwordResetToken}`;
    await this.mailerService.sendMail({
      to: email,
      from: 'noreply@example.com',
      subject: 'Your Verification Code',
      text: `Click the link to reset your password: ${passwordResetLink}`,
    });
    return passwordResetLink;
  }
}
