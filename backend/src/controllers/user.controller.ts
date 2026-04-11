import { Controller, Post, UseGuards, Req, Body } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { AuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../models/user.schema';
import { Request } from 'express';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private userService: UserService) {}

  // New route for 'Become Seller'
  @Post('become-seller')
  async becomeSeller(
    @Req() req: Request,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const userId = (req.user as any).sub;
    // Get the user ID from the request
    return this.userService.becomeSeller(userId); // Call service to update role
  }
}
