import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Prisma, Favorite } from '@prisma/client';
import { ClerkAuthGuard } from 'src/auth/clerk-auth.guard';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  // @UseGuards(ClerkAuthGuard)
  @Post()
  create(
    @Body() createFavoriteDto: Prisma.FavoriteUncheckedCreateInput,
  ): Promise<Favorite> {
    return this.favoritesService.create(createFavoriteDto);
  }

  @UseGuards(ClerkAuthGuard)
  @Get(':userId')
  findAll(@Param('userId') id: string): Promise<Favorite[]> {
    return this.favoritesService.findAll(id);
  }

  @UseGuards(ClerkAuthGuard)
  @Delete(':userId/:videoId')
  remove(
    @Param('userId') userId: string,
    @Param('videoId') videoId: string,
  ): Promise<Favorite> {
    return this.favoritesService.remove(userId, videoId);
  }
}
