import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { AuthModule } from 'src/auth/auth.module';
import { DatabaseService } from 'src/database/database.service';
import { APP_GUARD } from '@nestjs/core';
import { ClerkAuthGuard } from 'src/auth/clerk-auth.guard';

@Module({
  imports: [AuthModule],
  controllers: [FavoritesController],
  providers: [
    FavoritesService,
    DatabaseService,
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
  ],
})
export class FavoritesModule {}
