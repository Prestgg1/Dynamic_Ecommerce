import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Product } from '../products/entities/product.entity';
import { CreateOrderDto, UpdateOrderStatusDto } from './dtos/order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) { }

  async create(userId: number, dto: CreateOrderDto): Promise<Order> {
    if (!dto.items.length) throw new BadRequestException('Order must have at least one item');

    // Bütün productları bir dəfəyə çəkirik
    const productIds = dto.items.map((i) => i.productId);
    const products = await this.productsRepository.findByIds(productIds);

    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products not found');
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    let totalPrice = 0;
    const orderItems: Partial<OrderItem>[] = dto.items.map((item) => {
      const product = productMap.get(item.productId)!;
      if (!product.inStock) throw new BadRequestException(`Product "${product.name}" is out of stock`);

      const unitPrice = product.price;
      totalPrice += unitPrice * item.quantity;

      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
      };
    });

    const order = this.ordersRepository.create({
      userId,
      totalPrice,
      address: dto.address,
      phone: dto.phone,
      note: dto.note,
      status: OrderStatus.PENDING,
    });

    const savedOrder = await this.ordersRepository.save(order);

    const items = orderItems.map((item) =>
      this.orderItemsRepository.create({ ...item, orderId: savedOrder.id }),
    );
    await this.orderItemsRepository.save(items);

    return this.ordersRepository.findOne({
      where: { id: savedOrder.id },
      relations: ['items', 'items.product'],
    }) as Promise<Order>;
  }

  async findAllByUser(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { userId },
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number, userId: number, isAdmin: boolean): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });

    if (!order) throw new NotFoundException(`Order #${id} not found`);
    if (!isAdmin && order.userId !== userId) throw new ForbiddenException('Access denied');

    return order;
  }

  // Admin: bütün orderları gör
  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: ['items', 'items.product'],
      order: { createdAt: 'DESC' },
    });
  }

  // Admin: status dəyiş
  async updateStatus(id: number, dto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order #${id} not found`);

    order.status = dto.status;
    return this.ordersRepository.save(order);
  }

  async cancel(id: number, userId: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException(`Order #${id} not found`);
    if (order.userId !== userId) throw new ForbiddenException('Access denied');
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    order.status = OrderStatus.CANCELLED;
    return this.ordersRepository.save(order);
  }
}
