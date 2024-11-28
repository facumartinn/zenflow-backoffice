import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { Route, RouteStatus, Status } from '@prisma/client';
import { Client } from '@googlemaps/google-maps-services-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RoutesService {
  private googleMapsClient: Client;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.googleMapsClient = new Client({});
  }

  async create(createRouteDto: CreateRouteDto): Promise<Route> {
    const driver = await this.prisma.driver.findUnique({
      where: { id: createRouteDto.driverId },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    if (driver.status === Status.BUSY) {
      throw new BadRequestException('Driver is already assigned to a route');
    }

    // Create route and update driver status in a transaction
    const route = await this.prisma.$transaction(async (prisma) => {
      const newRoute = await prisma.route.create({
        data: {
          driverId: createRouteDto.driverId,
          orders: {
            connect: createRouteDto.orderIds.map(id => ({ id })),
          },
        },
        include: {
          driver: true,
          orders: true,
        },
      });

      await prisma.driver.update({
        where: { id: createRouteDto.driverId },
        data: { status: Status.BUSY },
      });

      return newRoute;
    });

    return route;
  }

  async findAll(): Promise<Route[]> {
    return this.prisma.route.findMany({
      include: {
        driver: true,
        orders: true,
      },
    });
  }

  async findOne(id: string): Promise<Route> {
    const route = await this.prisma.route.findUnique({
      where: { id },
      include: {
        driver: true,
        orders: true,
      },
    });

    if (!route) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }

    return route;
  }

  async update(id: string, updateRouteDto: UpdateRouteDto): Promise<Route> {
    try {
      return await this.prisma.route.update({
        where: { id },
        data: updateRouteDto,
        include: {
          driver: true,
          orders: true,
        },
      });
    } catch (error) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }
  }

  async remove(id: string): Promise<Route> {
    try {
      const route = await this.prisma.route.delete({
        where: { id },
        include: {
          driver: true,
        },
      });

      // Update driver status to available
      await this.prisma.driver.update({
        where: { id: route.driverId },
        data: { status: Status.AVAILABLE },
      });

      return route;
    } catch (error) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }
  }

  async updateStatus(id: string, status: RouteStatus): Promise<Route> {
    try {
      const route = await this.prisma.route.update({
        where: { id },
        data: { status },
        include: {
          driver: true,
          orders: true,
        },
      });

      // If route is completed, update driver status to available
      if (status === RouteStatus.COMPLETED) {
        await this.prisma.driver.update({
          where: { id: route.driverId },
          data: { status: Status.AVAILABLE },
        });
      }

      return route;
    } catch (error) {
      throw new NotFoundException(`Route with ID ${id} not found`);
    }
  }

  async optimizeRoute(orderIds: string[]): Promise<any> {
    const orders = await this.prisma.order.findMany({
      where: {
        id: { in: orderIds },
      },
    });

    if (orders.length < 2) {
      return orders;
    }

    const origins = orders.map(order => ({ lat: order.latitude, lng: order.longitude }));
    const destinations = [...origins];

    try {
      const response = await this.googleMapsClient.distancematrix({
        params: {
          origins,
          destinations,
          key: this.configService.get('GOOGLE_MAPS_API_KEY'),
        },
      });

      // Implement TSP (Traveling Salesman Problem) solution here
      // For now, return orders in original order
      return orders;
    } catch (error) {
      throw new BadRequestException('Failed to optimize route');
    }
  }
}