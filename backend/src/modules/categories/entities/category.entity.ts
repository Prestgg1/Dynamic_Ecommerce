import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import type { Product } from '../../products/entities/product.entity';

@Entity('categories')
export class Category {
  @PrimaryColumn()
  id: string;

  @Column()
  labelAz: string;

  @Column()
  labelRu: string;

  @Column()
  labelEn: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  icon: string;

  @OneToMany('Product', 'category', { onDelete: 'CASCADE', cascade: true })
  products: Product[];
}
