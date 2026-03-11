import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Headers,
  RawBodyRequest,
} from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthGuard } from '../common/guards/jwt-auth.guard';
import { CustomRequest } from '../interfaces/request.interface';
import { StripeService } from '../services/stripe.service';
import Stripe from 'stripe';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorators';
import { Request } from 'express';

@Controller('payment')
@UseGuards(RolesGuard)
export class StripeController {
  constructor(private readonly stripeService: StripeService) { }

  /**
   * POST /payment/create-checkout-session
   * Creates a Stripe checkout session for a customer.
   * Requires 'customer' role and authentication.
   */
  @Roles('customer')
  @UseGuards(AuthGuard)
  @Post('create-checkout-session')
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
    const { amount, currency, productId, quantity } = body;
    const userId = req.user.sub;
    return this.stripeService.createCheckoutSession(
      amount,
      currency,
      productId,
      quantity,
      userId,
    );
  }

  /**
   * POST /payment/webhook
   * Stripe webhook endpoint — receives events from Stripe.
   *
   * This route is PUBLIC (no auth required) because Stripe calls it directly.
   * Security is ensured by verifying the Stripe webhook signature.
   *
   * The raw body is needed for signature verification —
   * that's why we enabled `rawBody: true` in main.ts.
   */
  @Public()
  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.stripeService.handleWebhook(req.rawBody!, signature);
  }
}
