import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { AuthService } from './auth.service';
import { AuthenticatedRequest } from 'src/types';
import { ClerkAuthGuard } from './clerk-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(ClerkAuthGuard)
  @Get('me')
  getProfile(@Req() req: AuthenticatedRequest) {
    return req.user;
  }

  @UseGuards(ClerkAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  // only update the user's username, role or/and profileImage
  @UseGuards(ClerkAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAuthDto: Prisma.UserUpdateInput,
  ) {
    return this.authService.update(id, updateAuthDto);
  }

  @UseGuards(ClerkAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}
