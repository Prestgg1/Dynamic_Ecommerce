import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductResponseDto } from './dtos/product-responce.dto';
import { plainToInstance } from 'class-transformer';
import { Wishlist } from '../wishlist/entities/wishlist.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) { }

  private async getFavoriteProductIds(userId?: number): Promise<Set<number>> {
    if (!userId) return new Set();

    const items = await this.wishlistRepository.find({
      where: { userId },
      select: ['productId'],
    });

    return new Set(items.map((w) => w.productId));
  }
  public async remove(id: number) {
    let result = await this.productsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`ID-si ${id} olan məhsul tapılmadı`);
    }
  }

  private toDto(
    products: Product[],
    favoriteIds: Set<number>,
  ): ProductResponseDto[] {
    return products.map((p) =>
      plainToInstance(
        ProductResponseDto,
        { ...p, is_favorite: favoriteIds.has(p.id) },
        { excludeExtraneousValues: true },
      ),
    );
  }
  // products.service.ts daxilinə əlavə et

  async update(id: number, updateData: Partial<Product>, userId?: number): Promise<Product> {

    const product = await this.productsRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const updatedProduct = await this.productsRepository.preload({
      id: id,
      ...updateData,
    });

    if (!updatedProduct) {
      throw new Error('Update failed');
    }

    const savedProduct: Product = await this.productsRepository.save(updatedProduct);

    return savedProduct;
  }

  async findAll(
    query?: { categoryId?: string; q?: string },
    userId?: number,
  ): Promise<ProductResponseDto[]> {
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

    const [products, favoriteIds] = await Promise.all([
      this.productsRepository.find({ where, relations: ['category'] }),
      this.getFavoriteProductIds(userId),
    ]);

    return this.toDto(products, favoriteIds);
  }

  async findOne(
    id: number,
    userId?: number,
  ): Promise<ProductResponseDto | null> {
    const [product, favoriteIds] = await Promise.all([
      this.productsRepository.findOne({
        where: { id },
        relations: ['category'],
      }),
      this.getFavoriteProductIds(userId),
    ]);

    if (!product) return null;

    return this.toDto([product], favoriteIds)[0];
  }

  async findFeatured(userId?: number): Promise<ProductResponseDto[]> {
    const [products, favoriteIds] = await Promise.all([
      this.productsRepository.find({
        where: [{ isBestSeller: true }, { isNew: true }],
        take: 8,
        relations: ['category'],
      }),
      this.getFavoriteProductIds(userId),
    ]);

    return this.toDto(products, favoriteIds);
  }

  async create(product: Partial<Product>): Promise<Product> {
    const newProduct = this.productsRepository.create(product);
    return this.productsRepository.save(newProduct);
  }
}
