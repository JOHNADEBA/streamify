import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Prisma, Video } from '@prisma/client';

@Injectable()
export class VideoService {
  constructor(private databaseService: DatabaseService) {}

  async uploadVideo(data: Prisma.VideoCreateInput): Promise<Video> {
    let categories: { id: string }[];

    // Ensure ALL_CATEGORY_ID is always included
    const requiredCategoryId = process.env.ALL_CATEGORY_ID;
    if (!Array.isArray(data.categories.connect)) {
      data.categories.connect = [];
    }

    if (
      !data.categories.connect.some(
        (category) => category.id === requiredCategoryId,
      )
    ) {
      data.categories.connect.push({ id: requiredCategoryId });
    }

    // Validate categories
    if (!data.categories.connect || data.categories.connect.length === 0) {
      throw new BadRequestException('At least one category is required');
    }

    // Fetch all categories from the database to check if they exist
    try {
      categories = await this.databaseService.category.findMany({
        where: {
          id: { in: data.categories.connect.map((category) => category.id) },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P1001') {
          throw new Error(
            'Unable to establish a database connection. Please try again later.',
          );
        }
      }
      throw error;
    }

    // If not all provided categories are found, throw an error
    if (categories.length !== data.categories.connect.length) {
      throw new NotFoundException('One or more categories not found');
    }

    // Validate the video URL
    if (!data.muxPlaybackId) {
      throw new BadRequestException('Mux PlaybackUrl is required');
    }

    try {
      // Check if the video already exists by title and description (you can adjust the uniqueness check here)
      const existingVideo = await this.databaseService.video.findFirst({
        where: {
          title: data.title,
          description: data.description,
        },
        include: { categories: true },
      });

      let newCategoryIds = data.categories.connect.map(
        (category) => category.id,
      );

      if (existingVideo) {
        // Get the already associated category IDs from the existing video
        const existingCategoryIds = existingVideo.categories.map(
          (cat) => cat.id,
        );

        // Filter out categories that the video is already associated with
        newCategoryIds = data.categories.connect
          .map((category) => category.id)
          .filter((id) => !existingCategoryIds.includes(id));

        if (!existingCategoryIds.includes(requiredCategoryId)) {
          newCategoryIds.push(requiredCategoryId);
        }

        // If there are no new categories to connect, return the existing video
        if (newCategoryIds.length === 0) {
          const existingCategoryNames = existingVideo.categories
            .map((cat) => cat.name)
            .join(', ');

          throw new BadRequestException(
            `Video is already added to the following categories: ${existingCategoryNames}`,
          );
        }

        // Update the existing video and connect it to the new categories
        return this.databaseService.video.update({
          where: { id: existingVideo.id },
          data: {
            categories: {
              connect: newCategoryIds.map((id) => ({ id })),
            },
          },
          include: { categories: true },
        });
      }

      // If the video does not exist, create a new video and associate it with the categories
      return this.databaseService.video.create({
        data: {
          title: data.title,
          description: data.description || null,
          thumbnail: data.thumbnail || null,
          muxAssetId: data.muxAssetId,
          muxPlaybackId: data.muxPlaybackId,
          duration: data.duration,
          releaseDate: new Date(),
          aspectRatio: data.aspectRatio,
          categories: {
            connect: newCategoryIds.map((id) => ({ id })),
          },
        },
        include: { categories: true },
      });
    } catch (error) {
      if (error.response) {
        const uploadError = error.response.data || error.message;
        throw new BadRequestException(`Video upload failed: ${uploadError}`);
      } else {
        throw new BadRequestException('Failed to upload video to DB');
      }
    }
  }

  async getAllVideos(): Promise<Video[]> {
    return await this.databaseService.video.findMany({
      include: { categories: true },
    });
  }

  async getVideoById(id: string): Promise<Video> {
    const video = await this.databaseService.video.findUnique({
      where: { id },
      include: { categories: true },
    });

    if (!video) {
      throw new NotFoundException(`Video with ID ${id} not found`);
    }

    return video;
  }

  async updateVideo(id: string): Promise<Video> {
    const video = await this.getVideoById(id);
    return await this.databaseService.video.update({
      where: { id },
      data: {
        views: video.views + 1,
      },
      include: { categories: true },
    });
  }
}
