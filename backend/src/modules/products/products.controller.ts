import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import {
  ProductResponseDto,
  UpdateProductDto,
} from './dtos/product-responce.dto';
import type { RequestWithUserOptional } from '../../middleware/optional-auth-middleware';
import { AdminGuard } from '../../guards/admin.guard';

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
    @Req() req: RequestWithUserOptional,

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
    @Req() req: RequestWithUserOptional,
    @Param('id') id: string,
  ): Promise<ProductResponseDto | null> {
    return this.productsService.findOne(+id, req.user?.id);
  }
  @Put(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update product (Admin only)' })
  @ApiResponse({ status: 200, type: Product })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(+id, updateProductDto);
  }
  @Delete(':id')
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete Product (Admin only)' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.productsService.remove(+id);
  }
}
