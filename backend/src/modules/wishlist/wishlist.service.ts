import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) {}

  async findAllByUser(userId: number): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      where: { userId },
      relations: ['product', 'product.category'],
    });
  }

  async toggleWishlist(
    userId: number,
    productId: number,
    add: boolean,
  ): Promise<{ success: boolean }> {
    const existing = await this.wishlistRepository.findOne({
      where: { userId, productId },
    });

    if (add) {
      if (!existing) {
        const item = this.wishlistRepository.create({ userId, productId });
        await this.wishlistRepository.save(item);
      }
    } else {
      if (existing) {
        await this.wishlistRepository.remove(existing);
      }
    }

    return { success: true };
  }
}
