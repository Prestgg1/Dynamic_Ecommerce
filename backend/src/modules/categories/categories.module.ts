import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { OptionalAuthMiddleware } from 'src/middleware/optional-auth-middleware';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), AuthModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(OptionalAuthMiddleware)
      .forRoutes(
        { path: 'categories/:id', method: RequestMethod.PUT },
        { path: 'categories/:id', method: RequestMethod.DELETE },
      );
  }
}
