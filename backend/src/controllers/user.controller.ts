import { Controller, Post, UseGuards, Req, Body, Get, Delete, Param } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { AuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Roles as RoleEnum } from '../enums/roles.enums';
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

  // Admin Routes
  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Get('customers')
  async getCustomers(): Promise<User[]> {
    return this.userService.findAllCustomers();
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Get('sellers')
  async getSellers(): Promise<User[]> {
    return this.userService.findAllSellers();
  }

  @UseGuards(RolesGuard)
  @Roles(RoleEnum.ADMIN)
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<any> {
    return this.userService.deleteUser(id);
  }
}
