import { UserDocument } from '../models/user.schema';
import { Model } from 'mongoose';
import { LoginDto } from '../dtos/login.dto';
import { Auth } from '../models/auth.schema';
import { EmailService } from '../services/email.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from '../dtos/refreshToken.dto';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
export declare class AuthService {
    private userModel;
    private authModel;
    private emailService;
    private jwtService;
    constructor(userModel: Model<UserDocument>, authModel: Model<Auth>, emailService: EmailService, jwtService: JwtService);
    login(logInDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    generateToken(user: UserDocument): Promise<string>;
    generateRefreshToken(user: UserDocument): Promise<string>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        passwordResetLink: string;
    }>;
    generatePasswordResetToken(): Promise<string>;
    passwordUpdate(token: string, resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
