import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
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
product: Product;

  @Column()
  productId: number;

  @ManyToOne(() => User) // Review yazan user
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}
