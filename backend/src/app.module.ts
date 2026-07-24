import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { buildDatabaseConfig } from './database/typeorm.config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ReviewsModule } from './modules/reviews/review.module';
import { AdminSeedService } from './database/admin-seed.service';
import { SiteContentModule } from './modules/site-content/site-content.module';
import { ContactMessagesModule } from './modules/contact-messages/contact-messages.module';
import { UploadsModule } from './modules/uploads/uploads.module';

import { StatisticsModule } from './modules/statistics/statistics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        buildDatabaseConfig(configService.getOrThrow<string>('DATABASE_URL')),
    }),
    UsersModule,

    OrdersModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    WishlistModule,
    StatisticsModule,
    SiteContentModule,
    ContactMessagesModule,
    UploadsModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AdminSeedService],
})
export class AppModule {}
