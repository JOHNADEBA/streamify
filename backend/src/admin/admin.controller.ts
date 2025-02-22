import { Controller, Get, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { SetMetadata } from '@nestjs/common';
import { RolesGuard } from 'src/roles/roles.guard';

@Controller('admin')
export class AdminController {
  @SetMetadata('roles', [Role.ADMIN])
  @UseGuards(RolesGuard)
  @Get(':id')
  getAdminContent() {
    return 'This is admin content';
  }
}
