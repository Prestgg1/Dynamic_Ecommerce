import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoriesModule } from '../modules/categories/categories.module';
import { ProductsModule } from '../modules/products/products.module';
import { UsersModule } from '../modules/users/users.module';
import { OrdersModule } from '../modules/orders/orders.module';
import { SiteContentModule } from '../modules/site-content/site-content.module';
import { ContactMessagesModule } from '../modules/contact-messages/contact-messages.module';
import { SeedService } from './seed.service';
import { buildDatabaseConfig } from './typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        buildDatabaseConfig(configService.getOrThrow<string>('DATABASE_URL')),
    }),
    CategoriesModule,
    ProductsModule,
    UsersModule,
    OrdersModule,
    SiteContentModule,
    ContactMessagesModule,
  ],
  providers: [SeedService],
})
export class SeedModule {}
