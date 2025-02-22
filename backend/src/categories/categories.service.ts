import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Category } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(
    createCategoryDto: Prisma.CategoryCreateInput,
  ): Promise<Category> {
    const existingCategory = await this.databaseService.category.findUnique({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new BadRequestException('Category with this name already exists');
    }

    return this.databaseService.category.create({
      data: createCategoryDto,
    });
  }

  async createMany(
    createCategoryDto: Prisma.CategoryCreateInput[],
  ): Promise<Category[]> {
    await this.databaseService.category.createMany({
      data: createCategoryDto,
      skipDuplicates: true,
    });

    return await this.databaseService.category.findMany({
      where: {
        name: {
          in: createCategoryDto.map((category) => category.name),
        },
      },
    });
  }

  async findAll(): Promise<Category[]> {
    return this.databaseService.category.findMany({
      include: { videos: true },
    });
  }

  async findOne(id: string): Promise<Category> {
    const existingCategory = await this.databaseService.category.findUnique({
      where: { id },
      include: { videos: false },
    });

    if (!existingCategory) {
      throw new BadRequestException('Category does not exist');
    }

    return existingCategory;
  }

  async update(
    id: string,
    updateCategoryDto: Prisma.CategoryUpdateInput,
  ): Promise<Category> {
    await this.findOne(id);

    return this.databaseService.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: string): Promise<Category> {
    await this.findOne(id);
    return this.databaseService.category.delete({
      where: { id },
    });
  }
}
