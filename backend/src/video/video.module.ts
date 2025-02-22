import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [VideoController],
  providers: [VideoService, DatabaseService],
})
export class VideoModule {}
