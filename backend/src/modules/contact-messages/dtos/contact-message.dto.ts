import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateContactMessageDto {
  @ApiProperty()
  @IsString()
  @MinLength(2)
  fullName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty()
  @IsString()
  @MinLength(5)
  message: string;
}

export class UpdateContactMessageDto extends PartialType(
  CreateContactMessageDto,
) {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  status?: string;
}
