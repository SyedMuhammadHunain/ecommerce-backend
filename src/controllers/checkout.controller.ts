import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CheckoutService } from '../services/checkout.service';
import { CheckoutDto } from '../dtos/checkout.dto';
import { AuthGuard } from '../common/guards/jwt-auth.guard';
import { CustomRequest } from '../interfaces/request.interface';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('checkout')
@UseGuards(RolesGuard)

export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Roles('customer')
  @UseGuards(AuthGuard)
  @Post()
  createCheckout(@Body() checkoutDto: CheckoutDto, @Req() req: CustomRequest) {
    const userId = req.user.sub;
    return this.checkoutService.createCheckout(checkoutDto, userId);
  }
}
