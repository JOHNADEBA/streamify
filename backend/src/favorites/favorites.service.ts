import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Favorite } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    createFavoriteDto: Prisma.FavoriteUncheckedCreateInput,
  ): Promise<Favorite> {
    const { userId, videoId } = createFavoriteDto;
    // Check if the video exists
    const video = await this.databaseService.video.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      throw new BadRequestException('Video not found');
    }

    // Check if the video is already in favorites
    const existingFavorite = await this.databaseService.favorite.findFirst({
      where: {
        userId,
        videoId,
      },
    });

    if (existingFavorite) {
      throw new BadRequestException('Already in favorites');
    }

    return this.databaseService.favorite.create({
      data: createFavoriteDto,
    });
  }

  async findAll(userId: string): Promise<Favorite[]> {
    return this.databaseService.favorite.findMany({
      where: { userId },
      include: { video: true },
    });
  }

  async remove(userId: string, videoId: string): Promise<Favorite> {
    const favorite = await this.databaseService.favorite.findFirst({
      where: { userId, videoId },
    });

    if (!favorite) {
      throw new BadRequestException('Favorite not found');
    }

    return this.databaseService.favorite.delete({
      where: { id: favorite.id },
    });
  }
}
