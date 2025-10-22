import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User, UserDocument } from '../models/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dtos/login.dto';
import { Auth } from '../models/auth.schema';
import { EmailService } from '../services/email.service';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from '../dtos/refreshToken.dto';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import cryptoRandomString from 'crypto-random-string';
import { ResetPasswordDto } from '../dtos/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectModel('AuthCollections') private authModel: Model<Auth>,
    private emailService: EmailService,
    private jwtService: JwtService,
  ) {}

  async login(
    logInDto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = logInDto;
    const foundUser = await this.userModel.findOne({ email }).exec();

    if (!foundUser) {
      throw new UnauthorizedException(
        'Authentication failed: Invalid email or password',
      );
    }

    // First, check if the entered password is correct
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      throw new UnauthorizedException(
        'Authentication failed: Invalid email or password',
      );
    }

    // Secondly, check if the OTP code is correct
    const isValidOtp = await this.emailService.isValidOtp(logInDto);
    if (!isValidOtp) {
      throw new UnauthorizedException(
        'Authentication failed: Invalid verification code',
      );
    }

    // if Everything is correct, then update the user's isVerified to true
    const updatedUser = await this.userModel.findByIdAndUpdate(
      foundUser._id,
      { isVerified: true },
      { new: true },
    );

    if (!updatedUser) {
      throw new UnauthorizedException(
        'User not found after verification update',
      );
    }

    const accessToken = await this.generateToken(updatedUser);
    const refreshToken = await this.generateRefreshToken(updatedUser);
    return { accessToken, refreshToken };
  }

  // Generate a JWT token for the user
  async generateToken(user: UserDocument): Promise<string> {
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

  async generateRefreshToken(user: UserDocument): Promise<string> {
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

    // Hash the refresh token
    const saltRounds = 11;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedRt = await bcrypt.hash(refreshToken, salt);

    // Save the refresh token to the database
    await this.userModel.updateOne(
      { email: user.email },
      { $set: { hashedRefreshToken: hashedRt } },
    );

    return refreshToken;
  }

  async refreshToken(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ accessToken: string }> {
    const { refreshToken } = refreshTokenDto;

    try {
      // Verify the refresh token
      const decoded = await this.jwtService.verify(refreshToken, {
        secret: process.env.REFRESH_JWT_SECRET,
      });

      // Get the user with their roles
      const user = await this.userModel
        .findById(decoded.sub)
        .select('+hashedRefreshToken')
        .exec();

      if (!user) {
        throw new UnauthorizedException(
          'Authentication failed: User account not found',
        );
      }

      // Verify the refresh token matches what's stored
      const isValidRefreshToken = await bcrypt.compare(
        refreshToken,
        user.hashedRefreshToken,
      );

      if (!isValidRefreshToken) {
        throw new UnauthorizedException(
          'Authentication failed: Invalid refresh token',
        );
      }

      // Generate a new access token with the user's current roles
      const accessToken = await this.generateToken(user);

      return { accessToken };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          'Session expired: Please login again to continue',
        );
      }
      throw new UnauthorizedException(
        'Authentication failed: Invalid refresh token',
      );
    }
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ passwordResetLink: string }> {
    const { email } = forgotPasswordDto;

    // firstly find the user with the email
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException(
        'Account not found: No user registered with this email',
      );
    }

    // secondly, generate a password reset token
    const passwordResetToken = await this.generatePasswordResetToken();

    // thirdly, save the password reset token to the database temporarily
    await this.userModel.updateOne({ email }, { $set: { passwordResetToken } });

    // fourthly, send the password reset token to the user's email
    const passwordResetLink = await this.emailService.passwordResetEmail(
      email,
      passwordResetToken,
    );
    return { passwordResetLink };
  }

  async generatePasswordResetToken(): Promise<string> {
    const resetToken = cryptoRandomString({ length: 30, type: 'alphanumeric' });
    return resetToken;
  }

  // ChatGpt wrote this code, my mind bursted that time, so ChatGpt was my hero at that time
  async passwordUpdate(token: string, resetPasswordDto: ResetPasswordDto) {
    // Step 1: Retrieve all users who have a password reset token
    const users = await this.userModel
      .find({ passwordResetToken: { $exists: true } })
      .select(
        '+passwordResetToken +passwordResetTokenExpiresAt +hashedRefreshToken',
      );

    // Step 2: Iterate over the users and find a matching token
    let matchedUser: UserDocument | null = null;
    for (const user of users) {
      if (user.passwordResetToken === token) {
        matchedUser = user;
        break;
      }
    }

    // Step 3: If no user is found, throw an error
    if (!matchedUser) {
      throw new UnauthorizedException(
        'Password reset failed: Invalid or expired reset token',
      );
    }

    // Step 4: Check if the token is expired
    const now = new Date();
    if (
      matchedUser.passwordResetTokenExpiresAt &&
      matchedUser.passwordResetTokenExpiresAt < now
    ) {
      throw new UnauthorizedException(
        'Password reset failed: Reset token has expired. Please request a new one',
      );
    }

    // Step 5: If everything is correct, allow the user to proceed with password reset
    const { newPassword } = resetPasswordDto;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Step 6: Update the user's password and remove the reset token
    await this.userModel.updateOne(
      { _id: matchedUser._id },
      {
        $set: {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetTokenExpiresAt: null,
        },
      },
    );

    return { message: 'Password successfully updated' };
  }
}
