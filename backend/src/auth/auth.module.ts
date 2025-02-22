import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseService } from 'src/database/database.service';
import { ClerkAuthGuard } from './clerk-auth.guard';

@Module({
  controllers: [AuthController],
  exports: [AuthService],
  providers: [
    AuthService,
    DatabaseService,
    {
      provide: APP_GUARD,
      useClass: ClerkAuthGuard,
    },
  ],
})
export class AuthModule {}
