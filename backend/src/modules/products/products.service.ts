import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async findAll(query?: {
    categoryId?: string;
    q?: string;
  }): Promise<Product[]> {
    const where: FindOptionsWhere<Product>[] = [];

    const baseWhere: FindOptionsWhere<Product> = {};
    if (query?.categoryId && query.categoryId !== 'all') {
      baseWhere.categoryId = query.categoryId;
    }

    if (query?.q) {
      const q = `%${query.q}%`;
      where.push({ ...baseWhere, name: Like(q) });
      where.push({ ...baseWhere, nameRu: Like(q) });
      where.push({ ...baseWhere, nameEn: Like(q) });
      where.push({ ...baseWhere, description: Like(q) });
      where.push({ ...baseWhere, descriptionEn: Like(q) });
    } else {
      where.push(baseWhere);
    }

    return this.productsRepository.find({
      where,
      relations: ['category'],
    });
  }

  async findOne(id: number): Promise<Product | null> {
    return this.productsRepository.findOne({
      where: { id },
      relations: ['category'],
    });
  }

  async create(product: Partial<Product>): Promise<Product> {
    const newProduct = this.productsRepository.create(product);
    return this.productsRepository.save(newProduct);
  }

  async findFeatured(): Promise<Product[]> {
    return this.productsRepository.find({
      where: [{ isBestSeller: true }, { isNew: true }],
      take: 8,
      relations: ['category'],
    });
  }
}
