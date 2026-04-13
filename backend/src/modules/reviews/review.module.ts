import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './review.service';
import { ReviewsController } from './review.controller';
import { Review } from './entities/review.entity';
import { Product } from '../products/entities/product.entity'; // Product entity-nin yolu

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Product]),
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule { }
