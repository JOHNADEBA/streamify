import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category, Prisma } from '@prisma/client';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly logger: Logger,
  ) {}

  @Post()
  create(
    @Body() createCategoryDto: Prisma.CategoryCreateInput,
  ): Promise<Category> {
    this.logger.log(
      `${CategoriesController.name}: Creating single category`,
      createCategoryDto,
    );
    return this.categoriesService.create(createCategoryDto);
  }

  @Post('bulk')
  createMany(
    @Body() createCategoryDto: Prisma.CategoryCreateInput[],
  ): Promise<Category[]> {
    this.logger.log(
      `${CategoriesController.name}: Creating multiple categories`,
      createCategoryDto,
    );
    return this.categoriesService.createMany(createCategoryDto);
  }

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: Prisma.CategoryUpdateInput,
  ): Promise<Category> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
