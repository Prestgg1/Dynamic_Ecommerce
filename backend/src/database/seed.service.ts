import { Injectable, Logger } from '@nestjs/common';
import { CategoriesService } from '../modules/categories/categories.service';
import { ProductsService } from '../modules/products/products.service';
import { UsersService } from '../modules/users/users.service';
import { UserRole } from '../modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) {}

  async seed() {
    this.logger.log('Starting seeding...');

    // Categories
    const categoriesData = [
      {
        id: 'tools',
        labelAz: 'Alətlər',
        labelRu: 'Инструменты',
        labelEn: 'Tools',
        slug: 'tools',
        icon: 'tools',
      },
      {
        id: 'hardware',
        labelAz: 'Çilingər məmulatları',
        labelRu: 'Скобяные изделия',
        labelEn: 'Hardware',
        slug: 'hardware',
        icon: 'hardware',
      },
      {
        id: 'pipes',
        labelAz: 'Borular',
        labelRu: 'Трубы',
        labelEn: 'Pipes',
        slug: 'pipes',
        icon: 'pipes',
      },
      {
        id: 'fasteners',
        labelAz: 'Bəndlər',
        labelRu: 'Крепёж',
        labelEn: 'Fasteners',
        slug: 'fasteners',
        icon: 'fasteners',
      },
      {
        id: 'electrical',
        labelAz: 'Elektrik',
        labelRu: 'Электрика',
        labelEn: 'Electrical',
        slug: 'electrical',
        icon: 'electrical',
      },
      {
        id: 'welding',
        labelAz: 'Qaynaq',
        labelRu: 'Сварка',
        labelEn: 'Welding',
        slug: 'welding',
        icon: 'welding',
      },
      {
        id: 'safety',
        labelAz: 'Təhlükəsizlik',
        labelRu: 'Безопасность',
        labelEn: 'Safety',
        slug: 'safety',
        icon: 'safety',
      },
    ];

    for (const cat of categoriesData) {
      const existing = await this.categoriesService.findOne(cat.id);
      if (!existing) {
        await this.categoriesService.create(cat);
        this.logger.log(`Created category: ${cat.id}`);
      }
    }

    // Products
    const UNSPLASH_TOOLS = [
      'https://images.unsplash.com/photo-1581147036324-c17ac8fd3234?w=400&q=80',
      'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&q=80',
      'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80',
      'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400&q=80',
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&q=80',
      'https://images.unsplash.com/photo-1567449303183-ae0d6ed1498e?w=400&q=80',
    ];

    const productsData = [
      {
        id: 1,
        name: 'Professional Kəsici Dəst',
        nameRu: 'Профессиональный набор резцов',
        nameEn: 'Professional Cutting Set',
        description:
          'Yüksək keyfiyyətli polad kəsici dəst. Hər növ metal kəsmək üçün ideal.',
        descriptionRu:
          'Профессиональный набор резцов из высококачественной стали. Идеально подходит для резки любого металла.',
        descriptionEn:
          'High quality steel cutting set. Ideal for cutting any type of metal.',
        price: 89.99,
        oldPrice: 120.0,
        rating: 4.7,
        reviewCount: 142,
        categoryId: 'tools',
        image: UNSPLASH_TOOLS[0],
        images: [UNSPLASH_TOOLS[0], UNSPLASH_TOOLS[1], UNSPLASH_TOOLS[2]],
        inStock: true,
        isBestSeller: true,
        weight: '2.5 kq',
        material: 'Polad',
        dimensions: '30x20x10 sm',
        badge: 'Best Seller',
      },
      {
        id: 2,
        name: 'Çəkic Dəsti - 5 Ədəd',
        nameRu: 'Набор молотков - 5 шт.',
        nameEn: 'Hammer Set - 5 Pieces',
        description:
          'Müxtəlif ölçüdə 5 ədəd dəmir çəkic. Ağır iş şərtləri üçün.',
        descriptionRu:
          'Набор из 5 молотков разного размера. Для тяжёлых условий работы.',
        descriptionEn:
          'Set of 5 hammers of different sizes. For heavy-duty work.',
        price: 45.5,
        rating: 4.5,
        reviewCount: 87,
        categoryId: 'tools',
        image: UNSPLASH_TOOLS[1],
        images: [UNSPLASH_TOOLS[1], UNSPLASH_TOOLS[3]],
        inStock: true,
        isNew: true,
        weight: '3.8 kq',
        material: 'Xrom-vanadiyli polad',
        dimensions: 'Müxtəlif',
        badge: 'Yeni',
      },
      {
        id: 3,
        name: 'Metal Boru Set - 1 Düym',
        nameRu: 'Набор металлических труб - 1 дюйм',
        nameEn: 'Metal Pipe Set - 1 Inch',
        description:
          'Su və qaz xətləri üçün 1 düymlük metal borular. Paslanmayan polad.',
        descriptionRu:
          'Металлические трубы 1 дюйм для водопроводных и газовых линий. Нержавеющая сталь.',
        descriptionEn:
          '1 inch metal pipes for water and gas lines. Stainless steel.',
        price: 32.0,
        oldPrice: 38.0,
        rating: 4.3,
        reviewCount: 65,
        categoryId: 'pipes',
        image: UNSPLASH_TOOLS[2],
        images: [UNSPLASH_TOOLS[2]],
        inStock: true,
        weight: '5 kq',
        material: 'Paslanmayan polad',
        dimensions: '1 düym x 3 metr',
      },
      {
        id: 4,
        name: 'Vida Dəsti - 500 Ədəd',
        nameRu: 'Набор винтов - 500 шт.',
        nameEn: 'Screw Set - 500 Pieces',
        description:
          'Müxtəlif ölçüdə 500 ədəd vida. Tikinti işləri üçün ideal.',
        descriptionRu:
          '500 винтов разных размеров. Идеально подходит для строительства.',
        descriptionEn:
          '500 screws of various sizes. Ideal for construction work.',
        price: 15.99,
        rating: 4.6,
        reviewCount: 230,
        categoryId: 'fasteners',
        image: UNSPLASH_TOOLS[3],
        images: [UNSPLASH_TOOLS[3], UNSPLASH_TOOLS[4]],
        inStock: true,
        isBestSeller: true,
        weight: '1.2 kq',
        material: 'Mis örtüklü polad',
        dimensions: 'Müxtəlif',
        badge: 'Populyar',
      },
      {
        id: 5,
        name: 'Qaynaq Aparatı MIG-200',
        nameRu: 'Сварочный аппарат MIG-200',
        nameEn: 'Welding Machine MIG-200',
        description:
          'Peşəkar MIG qaynaq aparatı. 200A gücündə, sürətli qaynaq üçün.',
        descriptionRu:
          'Профессиональный сварочный аппарат MIG. Мощность 200А, для быстрой сварки.',
        descriptionEn:
          'Professional MIG welding machine. 200A power, for fast welding.',
        price: 299.0,
        oldPrice: 350.0,
        rating: 4.8,
        reviewCount: 55,
        categoryId: 'welding',
        image: UNSPLASH_TOOLS[4],
        images: [UNSPLASH_TOOLS[4], UNSPLASH_TOOLS[0]],
        inStock: true,
        weight: '12 kq',
        material: 'Polad gövdə',
        dimensions: '40x30x25 sm',
        badge: 'Premium',
      },
      {
        id: 6,
        name: 'Elektrik Kabel - 100m',
        nameRu: 'Электрический кабель - 100м',
        nameEn: 'Electric Cable - 100m',
        description: '2.5mm² mis elektrik kabeli. 100 metr rulon şəklində.',
        descriptionRu: 'Медный электрический кабель 2,5 мм². Рулон 100 метров.',
        descriptionEn: '2.5mm² copper electric cable. 100 meter roll.',
        price: 78.0,
        rating: 4.4,
        reviewCount: 112,
        categoryId: 'electrical',
        image: UNSPLASH_TOOLS[5],
        images: [UNSPLASH_TOOLS[5]],
        inStock: true,
        isNew: true,
        weight: '8 kq',
        material: 'Mis',
        dimensions: '2.5mm² x 100m',
        badge: 'Yeni',
      },
      {
        id: 7,
        name: 'Qoruyucu Dəbilqə',
        nameRu: 'Защитная каска',
        nameEn: 'Safety Helmet',
        description:
          'İnşaat və sənaye işləri üçün sertifikatlı qoruyucu dəbilqə.',
        descriptionRu:
          'Сертифицированная защитная каска для строительных и промышленных работ.',
        descriptionEn:
          'Certified safety helmet for construction and industrial work.',
        price: 18.5,
        rating: 4.2,
        reviewCount: 78,
        categoryId: 'safety',
        image: UNSPLASH_TOOLS[6],
        images: [UNSPLASH_TOOLS[6], UNSPLASH_TOOLS[7]],
        inStock: true,
        weight: '0.5 kq',
        material: 'Polipropilen',
        dimensions: 'Universial ölçü',
      },
      {
        id: 8,
        name: 'Çilingər Sxem Dəsti',
        nameRu: 'Набор слесарных принадлежностей',
        nameEn: 'Hardware Fittings Set',
        description:
          'Qapı qurğuları, mişar, bağlama hissələri daxil olmaqla tam dəst.',
        descriptionRu:
          'Полный набор, включая дверную фурнитуру, петли, крепежные элементы.',
        descriptionEn:
          'Complete set including door fittings, hinges, and locking components.',
        price: 55.0,
        oldPrice: 70.0,
        rating: 4.5,
        reviewCount: 95,
        categoryId: 'hardware',
        image: UNSPLASH_TOOLS[7],
        images: [UNSPLASH_TOOLS[7], UNSPLASH_TOOLS[0]],
        inStock: true,
        weight: '2 kq',
        material: 'Mis və polad',
        dimensions: 'Müxtəlif',
      },
      {
        id: 9,
        name: 'Polad Xətt Qaydası 1m',
        nameRu: 'Стальная линейка 1м',
        nameEn: 'Steel Ruler 1m',
        description:
          'Dəqiq ölçü üçün paslanmayan poladdan hazırlanmış 1 metrlik xətt.',
        descriptionRu:
          'Стальная линейка 1 метр из нержавеющей стали для точных измерений.',
        descriptionEn:
          '1 meter stainless steel ruler for precise measurements.',
        price: 12.99,
        rating: 4.6,
        reviewCount: 200,
        categoryId: 'tools',
        image: UNSPLASH_TOOLS[0],
        images: [UNSPLASH_TOOLS[0]],
        inStock: true,
        isBestSeller: true,
        weight: '0.3 kq',
        material: 'Paslanmayan polad',
        dimensions: '100x3x0.2 sm',
        badge: 'Best Seller',
      },
      {
        id: 10,
        name: 'Pnömatik Qaynaq Maskası',
        nameRu: 'Пневматическая сварочная маска',
        nameEn: 'Pneumatic Welding Mask',
        description: 'Avtomatik qaralan şüşəli qaynaq maskası. UV qoruması.',
        descriptionRu: 'Сварочная маска с автозатемнением. УФ-защита.',
        descriptionEn: 'Auto-darkening welding mask with UV protection.',
        price: 65.0,
        oldPrice: 80.0,
        rating: 4.7,
        reviewCount: 43,
        categoryId: 'welding',
        image: UNSPLASH_TOOLS[1],
        images: [UNSPLASH_TOOLS[1], UNSPLASH_TOOLS[2]],
        inStock: true,
        isNew: true,
        weight: '0.6 kq',
        material: 'Polimer',
        dimensions: '30x25x15 sm',
        badge: 'Yeni',
      },
      {
        id: 11,
        name: 'Paslanmayan Flanç DN50',
        nameRu: 'Фланец нержавеющий DN50',
        nameEn: 'Stainless Steel Flange DN50',
        description:
          'DN50 ölçüsündə paslanmayan polad flanç. Sənaye xətləri üçün.',
        descriptionRu:
          'Нержавеющий фланец DN50. Для промышленных трубопроводов.',
        descriptionEn: 'DN50 stainless steel flange for industrial pipelines.',
        price: 22.5,
        rating: 4.3,
        reviewCount: 37,
        categoryId: 'pipes',
        image: UNSPLASH_TOOLS[2],
        images: [UNSPLASH_TOOLS[2]],
        inStock: false,
        weight: '0.8 kq',
        material: 'Paslanmayan polad',
        dimensions: 'DN50',
      },
      {
        id: 12,
        name: 'LED Sənaye Lampası 50W',
        nameRu: 'Промышленный LED светильник 50W',
        nameEn: 'Industrial LED Light 50W',
        description:
          'İnşaat sahəsi və anbar üçün 50W LED işıq. IP65 su keçirməzlik.',
        descriptionRu:
          'Промышленный светодиодный светильник 50 Вт для стройплощадки и склада. Водозащита IP65.',
        descriptionEn:
          '50W LED industrial light for construction sites and warehouses. IP65 waterproof.',
        price: 42.0,
        oldPrice: 55.0,
        rating: 4.5,
        reviewCount: 68,
        categoryId: 'electrical',
        image: UNSPLASH_TOOLS[3],
        images: [UNSPLASH_TOOLS[3], UNSPLASH_TOOLS[4]],
        inStock: true,
        weight: '1.2 kq',
        material: 'Alüminium',
        dimensions: '30x15x8 sm',
      },
    ];

    for (const prod of productsData) {
      const existing = await this.productsService.findOne(prod.id);
      if (!existing) {
        await this.productsService.create(prod);
        this.logger.log(`Created product: ${prod.nameEn}`);
      }
    }

    // Users
    const testEmail = 'admin@demirmart.az';
    const existingUser = await this.usersService.findByEmail(testEmail);
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      await this.usersService.create({
        fullName: 'Admin',
        email: testEmail,
        password: hashedPassword,
        role: UserRole.ADMIN,
        avatarUrl:
          'https://ui-avatars.com/api/?background=f97316&color=fff&name=Test+User',
      });
      this.logger.log(`Created test user: ${testEmail}`);
    }

    this.logger.log('Seeding completed.');
  }
}
