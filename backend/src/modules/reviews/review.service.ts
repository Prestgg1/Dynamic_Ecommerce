import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Review } from './entities/review.entity';
import { Product } from '../products/entities/product.entity';
import { CreateReviewDto } from './dtos/review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource: DataSource, // Reytinqi hesablamaq və update etmək üçün
  ) { }

  async create(userId: number, dto: CreateReviewDto) {
    const { productId, message, starCount } = dto;

    // 1. Məhsulun mövcudluğunu yoxla
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Məhsul tapılmadı');
    }

    // 2. Transaction başladırıq ki, həm rəy yazılsın, həm product update olunsun
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Rəyi yarat və yadda saxla
      const newReview = this.reviewRepository.create({
        userId: userId.toString(),
        productId,
        message,
        rating: starCount, // Sizin entity-dəki sahə adı
      });
      const savedReview = await queryRunner.manager.save(newReview);

      // 3. Bu məhsula aid bütün rəylərin statistikasını hesabla
      const reviews = await queryRunner.manager.find(Review, {
        where: { productId },
      });

      const reviewCount = reviews.length;
      const totalStars = reviews.reduce((sum, item) => sum + item.rating, 0);
      const avgRating = parseFloat((totalStars / reviewCount).toFixed(1));

      // 4. Product modelini yeni dəyərlərlə yenilə
      await queryRunner.manager.update(Product, productId, {
        reviewCount: reviewCount,
        rating: avgRating,
      });

      await queryRunner.commitTransaction();
      return savedReview;

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Rəy əlavə edilərkən xəta baş verdi');
    } finally {
      await queryRunner.release();
    }
  }

  async findAllByProduct(productId: number) {
    return this.reviewRepository.find({
      where: { productId },
      relations: ['user'], // User-in adını və s. görmək üçün
      order: { createdAt: 'DESC' },
    });
  }

  async remove(id: number, userId: number) {
    const review = await this.reviewRepository.findOne({ where: { id, userId: userId.toString() } });
    if (!review) {
      throw new NotFoundException('Rəy tapılmadı və ya silmək icazəniz yokdur');
    }

    await this.reviewRepository.remove(review);
    // Qeyd: Real layihədə silinmədən sonra reytinqi yenidən hesablamaq yaxşı olar
    return { message: 'Rəy uğurla silindi' };
  }

  async removeAdmin(id: number) {
    const result = await this.reviewRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Rəy tapılmadı');
    }
    return { message: 'Rəy admin tərəfindən silindi' };
  }
}
