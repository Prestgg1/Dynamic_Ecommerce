import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class CreateOrderItemDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  productId: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiPropertyOptional({ example: 'Nizami küç. 10, Bakı' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: '+994501234567' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Zəng etməyin, mesaj yazın' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: OrderStatus, example: OrderStatus.CONFIRMED })
  @IsEnum(OrderStatus)
  status: OrderStatus;
}

export class OrderItemResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() productId: number;
  @ApiProperty() quantity: number;
  @ApiProperty() unitPrice: number;
}

export class OrderResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() userId: number;
  @ApiProperty({ enum: OrderStatus }) status: OrderStatus;
  @ApiProperty() totalPrice: number;
  @ApiProperty({ nullable: true }) address: string;
  @ApiProperty({ nullable: true }) phone: string;
  @ApiProperty({ nullable: true }) note: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty({ type: [OrderItemResponseDto] }) items: OrderItemResponseDto[];
}
