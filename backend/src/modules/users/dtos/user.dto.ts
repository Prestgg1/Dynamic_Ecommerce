import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @Expose()
  @ApiProperty() id: number;

  @Expose()
  @ApiProperty() email: string;

  @Expose()
  @ApiProperty() name: string;

  @Expose()
  @ApiProperty() isAdmin: boolean;

  @Expose()
  @ApiProperty() createdAt: Date;
}
