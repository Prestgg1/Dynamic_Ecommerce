import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  nameRu: string;

  @Column()
  nameEn: string;

  @Column('text')
  description: string;

  @Column('text', { nullable: true })
  descriptionRu: string;

  @Column('text', { nullable: true })
  descriptionEn: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  price: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string | null) => (value ? parseFloat(value) : null),
    },
  })
  oldPrice?: number;

  @Column('float', { default: 0 })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: string;

  @Column()
  image: string;

  @Column('simple-json', { nullable: true })
  images: string[];

  @Column({ default: true })
  inStock: boolean;

  @Column({ default: false })
  isNew: boolean;

  @Column({ default: false })
  isBestSeller: boolean;

  @Column({ nullable: true })
  weight: string;

  @Column({ nullable: true })
  material: string;

  @Column({ nullable: true })
  dimensions: string;

  @Column({ nullable: true })
  badge: string;
}
