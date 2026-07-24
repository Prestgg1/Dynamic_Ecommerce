import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
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
  name: string;

  @ApiProperty({ example: 'Название продукта' })
  @IsString()
  nameRu: string;

  @ApiProperty({ example: 'Product Name' })
  @IsString()
  nameEn: string;

  @ApiProperty({ example: 'Məhsul haqqında geniş məlumat' })
  @IsString()
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
  price: number;

  @ApiProperty({ example: 20.0, required: false })
  @IsNumber()
  @IsOptional()
  oldPrice?: number;

  @ApiProperty({ example: 4.5, required: false })
  @IsNumber()
  @IsOptional()
  rating?: number;

  @ApiProperty({ example: 'category-slug' })
  @IsString()
  categoryId: string;

  @ApiProperty({ example: 'image-url.jpg' })
  @IsString()
  image: string;

  @ApiProperty({ example: ['img1.jpg', 'img2.jpg'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  inStock?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isNew?: boolean;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  isBestSeller?: boolean;

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

  @ApiProperty({ example: 'new', required: false })
  @IsString()
  @IsOptional()
  badge?: string;
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
