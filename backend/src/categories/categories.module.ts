import { Module, Logger } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, DatabaseService, Logger],
})
export class CategoriesModule {}
