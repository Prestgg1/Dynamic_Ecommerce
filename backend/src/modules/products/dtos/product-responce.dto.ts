import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsNotEmpty,
  Min,
} from 'class-validator';

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
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Название продукта' })
  @IsString()
  @IsNotEmpty()
  nameRu: string;

  @ApiProperty({ example: 'Product Name' })
  @IsString()
  @IsNotEmpty()
  nameEn: string;

  @ApiProperty({ example: 'Məhsul haqqında geniş məlumat' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Описание продукта', required: false })
  @IsString()
  @IsOptional()
  descriptionRu?: string;

  @ApiProperty({ example: 'Product description', required: false })
  @IsString()
  @IsOptional()
  descriptionEn?: string;

  @ApiProperty({ example: 15.5 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 20.0, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  oldPrice?: number;

  @ApiProperty({ example: 'category-slug' })
  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ example: 'image-url.jpg' })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({ example: ['img1.jpg', 'img2.jpg'], required: false })
  @IsOptional()
  images?: string[];

  @ApiProperty({ example: '500g', required: false })
  @IsString()
  @IsOptional()
  weight?: string;

  @ApiProperty({ example: 'Plastik', required: false })
  @IsString()
  @IsOptional()
  material?: string;

  @ApiProperty({ example: '10x20x30', required: false })
  @IsString()
  @IsOptional()
  dimensions?: string;
}
export class UpdateProductDto extends PartialType(CreateProductDto) {}

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
