import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthMiddleware } from './auth.middleware';
import { DatabaseModule } from './database/database.module';
import { VideoModule } from './video/video.module';
import { DatabaseService } from './database/database.service';
import { AuthModule } from './auth/auth.module';
import { AdminController } from './admin/admin.controller';
import { AdminModule } from './admin/admin.module';
import { CategoriesModule } from './categories/categories.module';
import { WatchHistoryModule } from './watch-history/watch-history.module';
import { FavoritesModule } from './favorites/favorites.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    DatabaseModule,
    VideoModule,
    AuthModule,
    AdminModule,
    CategoriesModule,
    WatchHistoryModule,
    FavoritesModule,
    SubscriptionsModule,
  ],
  providers: [DatabaseService],
  controllers: [AdminController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude('/categories', '/categories/*', '/videos', '/videos/*') // Allow public category access
      .forRoutes(CategoriesModule);
  }
}
