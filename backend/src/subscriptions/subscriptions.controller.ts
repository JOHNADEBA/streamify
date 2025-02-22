import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { ClerkAuthGuard } from 'src/auth/clerk-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @UseGuards(ClerkAuthGuard)
  @Post()
  create(@Body() createSubscriptionDto: Prisma.SubscriptionCreateInput) {
    return this.subscriptionsService.create(createSubscriptionDto);
  }

  @UseGuards(ClerkAuthGuard)
  @Get(':id')
  find(@Param('id') id: string) {
    return this.subscriptionsService.find(id);
  }

  @UseGuards(ClerkAuthGuard)
  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.subscriptionsService.cancel(id);
  }
}
