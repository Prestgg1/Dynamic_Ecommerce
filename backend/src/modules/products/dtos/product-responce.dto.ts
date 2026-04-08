import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

class CategoryDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  name: string;
}



export class CreateProductDto {
  @ApiProperty({ example: 'Məhsul adı' })
  name: string;

  @ApiProperty({ example: 'Название продукта' })
  nameRu: string;

  @ApiProperty({ example: 'Product Name' })
  nameEn: string;

  @ApiProperty({ example: 'Məhsul haqqında geniş məlumat' })
  description: string;

  @ApiProperty({ example: 'Описание продукта', required: false })
  descriptionRu?: string;

  @ApiProperty({ example: 'Product description', required: false })
  descriptionEn?: string;

  @ApiProperty({ example: 15.50 })
  price: number;

  @ApiProperty({ example: 20.00, required: false })
  oldPrice?: number;

  @ApiProperty({ example: 'category-slug' })
  categoryId: string;

  @ApiProperty({ example: 'image-url.jpg' })
  image: string;

  @ApiProperty({ example: ['img1.jpg', 'img2.jpg'], required: false })
  images?: string[];

  @ApiProperty({ example: '500g', required: false })
  weight?: string;

  @ApiProperty({ example: 'Plastik', required: false })
  material?: string;

  @ApiProperty({ example: '10x20x30', required: false })
  dimensions?: string;


} export class UpdateProductDto extends PartialType(CreateProductDto) { }

export class ProductResponseDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  nameRu: string;

  @Expose()
  @ApiProperty()
  nameEn: string;

  @Expose()
  @ApiProperty()
  description: string;

  @Expose()
  @ApiPropertyOptional()
  descriptionRu: string;

  @Expose()
  @ApiPropertyOptional()
  descriptionEn: string;

  @Expose()
  @ApiProperty()
  price: number;

  @Expose()
  @ApiPropertyOptional()
  oldPrice?: number;

  @Expose()
  @ApiProperty()
  rating: number;

  @Expose()
  @ApiProperty()
  reviewCount: number;

  @Expose()
  @ApiProperty()
  image: string;

  @Expose()
  @ApiPropertyOptional({ type: [String] })
  images: string[];

  @Expose()
  @ApiProperty()
  inStock: boolean;

  @Expose()
  @ApiProperty()
  isNew: boolean;

  @Expose()
  @ApiProperty()
  isBestSeller: boolean;

  @Expose()
  @ApiPropertyOptional()
  weight: string;

  @Expose()
  @ApiPropertyOptional()
  material: string;

  @Expose()
  @ApiPropertyOptional()
  dimensions: string;

  @Expose()
  @ApiPropertyOptional()
  badge: string;

  @Expose()
  @ApiProperty({ type: () => CategoryDto })
  @Type(() => CategoryDto)
  category: CategoryDto;

  @Expose()
  @ApiProperty({ default: false })
  is_favorite: boolean;
}
