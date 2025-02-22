import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, WatchHistory } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class WatchHistoryService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    createWatchHistoryDto: Prisma.WatchHistoryUncheckedCreateInput,
  ): Promise<WatchHistory> {
    const { userId, videoId } = createWatchHistoryDto;

    // Check if video exists
    const video = await this.databaseService.video.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      throw new BadRequestException('Video not found');
    }

    // Check if the user has already watched the video
    const existingEntry = await this.databaseService.watchHistory.findFirst({
      where: { userId, videoId },
    });

    if (existingEntry) {
      // Update watchedAt timestamp if entry exists
      return this.databaseService.watchHistory.update({
        where: { id: existingEntry.id },
        data: { watchedAt: new Date() },
      });
    } else {
      // Create a new entry if it doesn't exist
      return await this.databaseService.watchHistory.create({
        data: createWatchHistoryDto,
      });
    }
  }

  async findAll(userId: string): Promise<WatchHistory[]> {
    return await this.databaseService.watchHistory.findMany({
      where: { userId },
      include: { video: true },
    });
  }
}
