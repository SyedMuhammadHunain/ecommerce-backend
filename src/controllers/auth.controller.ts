import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from 'src/dtos/signup.dto';
import { AuthService } from 'src/services/auth.service';
import { LoginDto } from 'src/dtos/login.dto';
import { EmailService } from 'src/services/email.service';
import { UserService } from 'src/services/user.service';
import { ResendOtpDto } from 'src/dtos/resendOtp.dto';
import { RefreshTokenDto } from 'src/dtos/refreshToken.dto';
import { ForgotPasswordDto } from 'src/dtos/forgot-password.dto';
import { ResetPasswordDto } from 'src/dtos/reset-password.dto';
import { Public } from 'src/common/decorators/public.decorators';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailService: EmailService,
    private userService: UserService,
  ) {}

  @Public()
  @Post('/signUp')
  async signUp(@Body() signUpDto: SignUpDto) {
    const user = await this.userService.createUser(signUpDto);
    await this.emailService.sendEmail(signUpDto.email);
    return {
      message: 'Signed Up',
    };
  }

  @Public()
  @Post('/login')
  async login(
    @Body() logInDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.login(logInDto);
  }

  @Public()
  @Post('/resend-otp')
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return this.emailService.resendOtp(resendOtpDto);
  }

  @Public()
  @Post('/forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ passwordResetLink: string }> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Public()
  @Post('/refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    try {
      return await this.authService.refreshToken(refreshTokenDto);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  @Public()
  @Patch('/reset-password/:token')
  async passwordResetLink(
    @Param('token') token: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    console.log(resetPasswordDto);
    return this.authService.passwordUpdate(token, resetPasswordDto);
  }
}
