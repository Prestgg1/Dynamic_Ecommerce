import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CategoriesModule } from '../modules/categories/categories.module';
import { ProductsModule } from '../modules/products/products.module';
import { UsersModule } from '../modules/users/users.module';
import { OrdersModule } from '../modules/orders/orders.module';
import { SeedService } from './seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    CategoriesModule,
    ProductsModule,
    UsersModule,
    OrdersModule,
  ],
  providers: [SeedService],
})
export class SeedModule {}
