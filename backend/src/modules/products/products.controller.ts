import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'q', required: false })
  @ApiResponse({ status: 200, type: [Product] })
  findAll(
    @Query('categoryId') categoryId?: string,
    @Query('q') q?: string,
  ): Promise<Product[]> {
    return this.productsService.findAll({ categoryId, q });
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured products' })
  @ApiResponse({ status: 200, type: [Product] })
  findFeatured(): Promise<Product[]> {
    return this.productsService.findFeatured();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id' })
  findOne(@Param('id') id: string): Promise<Product | null> {
    return this.productsService.findOne(+id);
  }
}
