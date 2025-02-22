import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { VideoService } from './video.service';
import { Prisma, Video } from '@prisma/client';

@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post()
  uploadVideo(@Body() body: Prisma.VideoCreateInput): Promise<Video> {
    return this.videoService.uploadVideo(body);
  }

  @Get()
  getAllVideos(): Promise<Video[]> {
    return this.videoService.getAllVideos();
  }

  @Get(':id')
  getVideoById(@Param('id') id: string): Promise<Video | null> {
    return this.videoService.getVideoById(id);
  }

  @Patch(':id')
  updateVideo(@Param('id') id: string): Promise<Video> {
    return this.videoService.updateVideo(id);
  }
}
