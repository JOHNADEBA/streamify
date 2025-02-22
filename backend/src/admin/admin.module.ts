import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/roles/roles.guard';
import { AdminService } from './admin.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    AdminService,
    DatabaseService,
  ],
})
export class AdminModule {}
