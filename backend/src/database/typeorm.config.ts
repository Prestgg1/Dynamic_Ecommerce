import { join } from 'path';
import type { DataSourceOptions } from 'typeorm';
import { Session } from '../modules/auth/entities/session.entity';
import { Category } from '../modules/categories/entities/category.entity';
import { OrderItem } from '../modules/orders/entities/order-item.entity';
import { Order } from '../modules/orders/entities/order.entity';
import { Product } from '../modules/products/entities/product.entity';
import { Review } from '../modules/reviews/entities/review.entity';
import { SiteSetting } from '../modules/site-content/entities/site-setting.entity';
import { ContactMessage } from '../modules/contact-messages/entities/contact-message.entity';
import { User } from '../modules/users/entities/user.entity';
import { Wishlist } from '../modules/wishlist/entities/wishlist.entity';

export function buildDatabaseConfig(databaseUrl: string): DataSourceOptions {
  return {
    type: 'mysql',
    url: databaseUrl,
    entities: [
      User,
      Session,
      Category,
      Product,
      Wishlist,
      Order,
      OrderItem,
      Review,
      SiteSetting,
      ContactMessage,
    ],
    migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
    migrationsTableName: 'typeorm_migrations',
    synchronize: false,
    logging: process.env.DB_LOGGING === 'true',
  };
}
