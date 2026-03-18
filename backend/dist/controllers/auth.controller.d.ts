import { SignUpDto } from '../dtos/signup.dto';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dtos/login.dto';
import { EmailService } from '../services/email.service';
import { UserService } from '../services/user.service';
import { ResendOtpDto } from '../dtos/resendOtp.dto';
import { RefreshTokenDto } from '../dtos/refreshToken.dto';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
export declare class AuthController {
    private authService;
    private emailService;
    private userService;
    constructor(authService: AuthService, emailService: EmailService, userService: UserService);
    signUp(signUpDto: SignUpDto): Promise<{
        message: string;
    }>;
    login(logInDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    resendOtp(resendOtpDto: ResendOtpDto): Promise<void>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        passwordResetLink: string;
    }>;
    refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{
        accessToken: string;
    }>;
    passwordResetLink(token: string, resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
}
