import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { WatchHistoryService } from './watch-history.service';
import { Prisma, WatchHistory } from '@prisma/client';
import { ClerkAuthGuard } from 'src/auth/clerk-auth.guard';

@Controller('watch-history')
export class WatchHistoryController {
  constructor(private readonly watchHistoryService: WatchHistoryService) {}

  @UseGuards(ClerkAuthGuard)
  @Post()
  create(
    @Body() createWatchHistoryDto: Prisma.WatchHistoryUncheckedCreateInput,
  ): Promise<WatchHistory> {
    return this.watchHistoryService.create(createWatchHistoryDto);
  }

  @UseGuards(ClerkAuthGuard)
  @Get(':id')
  findAll(@Param('id') id: string): Promise<WatchHistory[]> {
    return this.watchHistoryService.findAll(id);
  }
}
