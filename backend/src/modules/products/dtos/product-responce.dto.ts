// src/products/dto/product-response.dto.ts
import { Expose, Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class CategoryDto {
  @Expose()
  @ApiProperty()
  id: string;

  @Expose()
  @ApiProperty()
  name: string;
}

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
