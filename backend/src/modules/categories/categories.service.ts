import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  async findOne(id: string): Promise<Category | null> {
    return this.categoriesRepository.findOne({ where: { id } });
  }

  async create(category: Partial<Category>): Promise<Category> {
    const newCategory = this.categoriesRepository.create(category);
    return this.categoriesRepository.save(newCategory);
  }
}
