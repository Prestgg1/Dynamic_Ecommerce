import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ProductResponseDto } from './dtos/product-responce.dto';
import type { RequestWithUser } from 'src/middleware/optional-auth-middleware';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'q', required: false })
  @ApiResponse({ status: 200, type: [Product] })
  findAll(
    @Req() req: RequestWithUser,

    @Query('categoryId') categoryId?: string,
    @Query('q') q?: string,
  ): Promise<ProductResponseDto[]> {
    return this.productsService.findAll({ categoryId, q }, req.user?.id);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured products' })
  @ApiResponse({ status: 200, type: [ProductResponseDto] })
  findFeatured(): Promise<ProductResponseDto[]> {
    return this.productsService.findFeatured();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by id' })
  @ApiResponse({ status: 200, type: ProductResponseDto })
  findOne(
    @Req() req: RequestWithUser,
    @Param('id') id: string): Promise<ProductResponseDto | null> {
    return this.productsService.findOne(+id, req.user?.id);
  }
}
