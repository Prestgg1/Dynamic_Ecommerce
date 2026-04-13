import { ApiProperty } from "@nestjs/swagger";


export class CreateReviewDto {
  @ApiProperty({ example: 1, description: 'Məhsulun ID-si' })
  productId: number;

  @ApiProperty({ example: 'Çox yaxşı məhsuldur', description: 'Rəy mətni' })
  message: string;

  @ApiProperty({ example: 5, description: 'Ulduz sayı (1-5 arası)' })
  starCount: number;
}


class ReviewUserDto {
  @ApiProperty({ example: '7d2...' })
  id: string;

  @ApiProperty({ example: 'Aasdd DSSA' })
  name: string;

  @ApiProperty({ example: 'avatar.jpg', nullable: true })
  image?: string;
}

export class ReviewResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Məhsul keyfiyyətlidir' })
  message: string;

  @ApiProperty({ example: 5 })
  starCount: number;

  @ApiProperty({ example: 101 })
  productId: number;

  @ApiProperty({ type: ReviewUserDto })
  user: ReviewUserDto;

  @ApiProperty({ example: '2026-04-10T12:00:00.000Z' })
  createdAt: Date;
}
