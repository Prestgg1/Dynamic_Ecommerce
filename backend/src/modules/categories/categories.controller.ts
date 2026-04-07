import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, type: [Category] })
  findAll(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by id' })
  @ApiResponse({ status: 200, type: Category })
  findOne(@Param('id') id: string): Promise<Category | null> {
    return this.categoriesService.findOne(id);
  }
}
