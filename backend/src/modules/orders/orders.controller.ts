import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, OrderResponseDto, UpdateOrderStatusDto } from './dtos/order.dto';
import { AdminGuard } from '../../guards/admin.guard';
import { AuthGuard } from '../../guards/auth.guard';
import type { RequestWithUser } from '../../middleware/optional-auth-middleware';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @ApiOperation({ summary: 'Create order' })
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 201, type: OrderResponseDto })
  create(@Req() req: RequestWithUser, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user.id, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my orders' })
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, type: [OrderResponseDto] })
  getMyOrders(@Req() req: RequestWithUser) {
    return this.ordersService.findAllByUser(req.user.id);
  }

  @Get('my/:id')
  @ApiOperation({ summary: 'Get my order by id' })
  @UseGuards(AuthGuard)
  @ApiResponse({ status: 200, type: OrderResponseDto })
  getMyOrder(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.ordersService.findOne(+id, req.user.id, false);
  }

  @Patch('my/:id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel my order' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  cancelOrder(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.ordersService.cancel(+id, req.user.id);
  }

  // ── Admin endpointlər ──────────────────────────────────────
  @Get('admin/all')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all orders (Admin only)' })
  @ApiResponse({ status: 200, type: [OrderResponseDto] })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('admin/:id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get any order by id (Admin only)' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  findOne(@Req() req: RequestWithUser, @Param('id') id: string) {
    return this.ordersService.findOne(+id, req.user.id, true);
  }

  @Patch('admin/:id/status')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Update order status (Admin only)' })
  @ApiResponse({ status: 200, type: OrderResponseDto })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(+id, dto);
  }
}
