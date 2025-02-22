import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, status } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { addMonths, isAfter } from 'date-fns';

@Injectable()
export class SubscriptionsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createSubscriptionDto: Prisma.SubscriptionCreateInput) {
    // Check if user already has a subscription
    const userId = createSubscriptionDto.user.connect.id;

    // Check for existing subscription
    const existingSubscription =
      await this.databaseService.subscription.findFirst({
        where: { userId },
      });

    if (existingSubscription) {
      // Extend the expiration date by 1 month from current expiration
      const newExpiryDate = addMonths(existingSubscription.createdAt, 1);
      return this.databaseService.subscription.update({
        where: { id: existingSubscription.id },
        data: { createdAt: newExpiryDate, status: status.Active },
      });
    }

    // If no existing subscription, create a new one with 1-month validity
    return this.databaseService.subscription.create({
      data: {
        userId,
        plan: createSubscriptionDto.plan,
        status: status.Active,
      },
    });
  }

  async find(userId: string) {
    return this.databaseService.subscription.findFirst({
      where: { userId },
    });
  }

  async cancel(subscriptionId: string) {
    const subscription = await this.databaseService.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return this.databaseService.subscription.update({
      where: { id: subscriptionId },
      data: { status: status.Canceled },
    });
  }

  async checkAndCancelExpiredSubscriptions() {
    const now = new Date();

    // Fetch all active subscriptions
    const subscriptions = await this.databaseService.subscription.findMany({
      where: { status: status.Active },
    });

    // Cancel subscriptions that have expired
    for (const subscription of subscriptions) {
      const expiryDate = addMonths(subscription.createdAt, 1);
      if (isAfter(now, expiryDate)) {
        await this.databaseService.subscription.update({
          where: { id: subscription.id },
          data: { status: status.Canceled },
        });
      }
    }
  }
}
