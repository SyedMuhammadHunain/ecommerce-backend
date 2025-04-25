import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { CheckoutService } from 'src/services/checkout.service';
import { CheckoutDto } from 'src/dtos/checkout.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CustomRequest } from 'src/interfaces/request.interface';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

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
