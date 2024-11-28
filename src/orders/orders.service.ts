import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    return this.prisma.order.create({
      data: createOrderDto,
    });
  }

  async findAll(): Promise<Order[]> {
    return this.prisma.order.findMany({
      include: {
        route: {
          include: {
            driver: true,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        route: {
          include: {
            driver: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    try {
      return await this.prisma.order.update({
        where: { id },
        data: updateOrderDto,
        include: {
          route: {
            include: {
              driver: true,
            },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }

  async remove(id: string): Promise<Order> {
    try {
      return await this.prisma.order.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    try {
      return await this.prisma.order.update({
        where: { id },
        data: { status },
        include: {
          route: {
            include: {
              driver: true,
            },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }

  async findPendingOrders(): Promise<Order[]> {
    return this.prisma.order.findMany({
      where: { status: OrderStatus.PENDING },
      include: {
        route: {
          include: {
            driver: true,
          },
        },
      },
    });
  }
}