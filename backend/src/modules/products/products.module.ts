import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Wishlist } from '../wishlist/entities/wishlist.entity';
import { AuthModule } from '../auth/auth.module';
import { OptionalAuthMiddleware } from 'src/middleware/optional-auth-middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Wishlist]), AuthModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(OptionalAuthMiddleware).forRoutes(ProductsController);
  }
}
