import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import type { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity'; // User entity-nizin yolu

@Entity('reviews')
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  message: string;

  @Column('int')
  rating: number; // Star count (məs: 1-5 arası)

  @ManyToOne('Product', 'reviews', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column()
  productId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' }) // Review yazan user
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;
}
