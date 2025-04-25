import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CustomRequest } from 'src/interfaces/request.interface';
import { StripeService } from 'src/services/stripe.service';
import Stripe from 'stripe';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('payment')
@UseGuards(RolesGuard)
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Roles('customer')
  @UseGuards(AuthGuard)
  @Post('create-checkout-session') // Define the route for creating a checkout session
  async createCheckoutSession(
    @Body()
    body: {
      amount: number;
      currency: string;
      productId: string;
      quantity: number;
    },
    @Req() req: CustomRequest,
  ): Promise<Stripe.Checkout.Session> {
    const { amount, currency, productId, quantity } = body; // Destructure the body to get the necessary parameters
    const userId = req.user.sub;
    return this.stripeService.createCheckoutSession(
      amount,
      currency,
      productId,
      quantity,
      userId,
    ); // Call the service method to create the session
  }
}
