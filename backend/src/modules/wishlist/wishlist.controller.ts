import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Req,
  UnauthorizedException,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { AuthService } from '../auth/auth.service';
import type { Request } from 'express';
import { Wishlist } from './entities/wishlist.entity';

@ApiTags('wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(
    private readonly wishlistService: WishlistService,
    private readonly authService: AuthService,
  ) {}

  private async getUserId(req: Request): Promise<number> {
    const sid = req.cookies?.sid as string | undefined;
    if (!sid) {
      throw new UnauthorizedException('Not authenticated');
    }
    const user = await this.authService.validateSession(sid);
    if (!user) {
      throw new UnauthorizedException('Session expired');
    }
    return user.id;
  }

  @Get()
  @ApiOperation({ summary: 'Get all wishlist items for current user' })
  @ApiResponse({ status: 200, type: [Wishlist] })
  async findAll(@Req() req: Request) {
    const userId = await this.getUserId(req);
    return this.wishlistService.findAllByUser(userId);
  }

  @Post(':productId')
  @ApiOperation({ summary: 'Add product to wishlist' })
  @ApiResponse({ status: 201, description: 'Added to wishlist' })
  async add(
    @Req() req: Request,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const userId = await this.getUserId(req);
    return this.wishlistService.toggleWishlist(userId, productId, true);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remove product from wishlist' })
  @ApiResponse({ status: 200, description: 'Removed from wishlist' })
  async remove(
    @Req() req: Request,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const userId = await this.getUserId(req);
    return this.wishlistService.toggleWishlist(userId, productId, false);
  }
}
