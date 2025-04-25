import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/models/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SignUpDto } from 'src/dtos/signup.dto';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Roles } from 'src/enums/roles.enums';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private authService: AuthService,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email }).exec();
  }

  async createUser(signUpDto: SignUpDto): Promise<User> {
    const { name, email, password } = signUpDto;
    const existingUser = await this.userModel.findOne({ email }).exec();

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      name,
      email,
      password: hashedPassword,
      role: Roles.CUSTOMER,
    });

    Logger.log(
      `User with name: ${name} and email: ${email} has signed up successfully`,
    );
    return await user.save();
  }

  async becomeSeller(userId: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.userModel.findById(userId).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === Roles.SELLER) {
      throw new ConflictException('You are already a seller');
    }

    // Update role to SELLER
    user.role = Roles.SELLER;
    await user.save();

    // Generate new tokens with updated role
    const aT = await this.authService.generateToken(user);
    const rT = await this.authService.generateRefreshToken(user);

    return {
      accessToken: aT,
      refreshToken: rT,
    };
  }
}
