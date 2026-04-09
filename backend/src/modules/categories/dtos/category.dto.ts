import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'electronics' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'Elektronika' })
  @IsString()
  labelAz: string;

  @ApiProperty({ example: 'Электроника' })
  @IsString()
  labelRu: string;

  @ApiProperty({ example: 'Electronics' })
  @IsString()
  labelEn: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) { }
