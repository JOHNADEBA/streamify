import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SubscriptionsService } from './subscriptions.service';

@Injectable()
export class SubscriptionCleanupService {
  private readonly logger = new Logger(SubscriptionCleanupService.name);

  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT) // Runs daily at midnight  EVERY_10_SECONDS
  async handleExpiredSubscriptions() {
    this.logger.log('Checking for expired subscriptions...');
    await this.subscriptionsService.checkAndCancelExpiredSubscriptions();
    this.logger.log('Expired subscriptions processed.');
  }
}
