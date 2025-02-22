import { Module } from '@nestjs/common';
import { WatchHistoryService } from './watch-history.service';
import { WatchHistoryController } from './watch-history.controller';
import { APP_GUARD } from '@nestjs/core';
import { ClerkAuthGuard } from 'src/auth/clerk-auth.guard';
import { DatabaseService } from 'src/database/database.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [WatchHistoryController],
  providers: [
    WatchHistoryService,
    DatabaseService,
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
  ],
})
export class WatchHistoryModule {}
