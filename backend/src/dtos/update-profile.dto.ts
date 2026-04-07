import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
