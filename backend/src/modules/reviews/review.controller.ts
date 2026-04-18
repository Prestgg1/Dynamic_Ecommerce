import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReviewsService } from './review.service';
import { CreateReviewDto, ReviewResponseDto } from './dtos/review.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { AdminGuard } from '../../guards/admin.guard';
import type { RequestWithUser } from '../../middleware/optional-auth-middleware';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Məhsula rəy əlavə et' })
  @ApiResponse({ status: 201, type: ReviewResponseDto })
  create(@Req() req: RequestWithUser, @Body() dto: CreateReviewDto) {
    // dto daxilində productId göndərilməlidir
    return this.reviewsService.create(req.user.id, dto);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Müəyyən məhsulun rəylərini gətir' })
  @ApiResponse({ status: 200, type: [ReviewResponseDto] })
  findByProduct(@Param('productId') productId: string) {
    return this.reviewsService.findAllByProduct(+productId);
  }

  @Delete(':id')
  @UseGuards(AuthGuard) // İstifadəçi öz rəyini silə bilsin deyə
  @ApiOperation({ summary: 'Rəyi sil' })
  remove(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.reviewsService.remove(+id, req.user.id);
  }

  // Admin üçün rəyləri silmək imkanı
  @Delete('admin/:id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Rəyi sil (Admin)' })
  adminRemove(@Param('id') id: string) {
    return this.reviewsService.removeAdmin(+id);
  }
}
