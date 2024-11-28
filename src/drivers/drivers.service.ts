import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { Driver, Status } from '@prisma/client';

@Injectable()
export class DriversService {
  constructor(private prisma: PrismaService) {}

  async create(createDriverDto: CreateDriverDto): Promise<Driver> {
    return this.prisma.driver.create({
      data: createDriverDto,
    });
  }

  async findAll(): Promise<Driver[]> {
    return this.prisma.driver.findMany({
      include: {
        routes: {
          include: {
            orders: true,
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<Driver> {
    const driver = await this.prisma.driver.findUnique({
      where: { id },
      include: {
        routes: {
          include: {
            orders: true,
          },
        },
      },
    });

    if (!driver) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }

    return driver;
  }

  async update(id: string, updateDriverDto: UpdateDriverDto): Promise<Driver> {
    try {
      return await this.prisma.driver.update({
        where: { id },
        data: updateDriverDto,
      });
    } catch (error) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }
  }

  async remove(id: string): Promise<Driver> {
    try {
      return await this.prisma.driver.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }
  }

  async updateStatus(id: string, status: Status): Promise<Driver> {
    try {
      return await this.prisma.driver.update({
        where: { id },
        data: { status },
      });
    } catch (error) {
      throw new NotFoundException(`Driver with ID ${id} not found`);
    }
  }

  async findAvailableDrivers(): Promise<Driver[]> {
    return this.prisma.driver.findMany({
      where: { status: Status.AVAILABLE },
      include: {
        routes: {
          include: {
            orders: true,
          },
        },
      },
    });
  }
}