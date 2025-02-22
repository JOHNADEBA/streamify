import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { DatabaseService } from 'src/database/database.service';
import { SubscriptionCleanupService } from './subscription-cleanup.service';
import { APP_GUARD } from '@nestjs/core';
import { ClerkAuthGuard } from 'src/auth/clerk-auth.guard';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [SubscriptionsController],
  providers: [
    SubscriptionsService,
    SubscriptionCleanupService,
    DatabaseService,
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
  ],
})
export class SubscriptionsModule {}
