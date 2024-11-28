import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { UpdateDriverStatusDto } from './dto/update-driver-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('drivers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('drivers')
export class DriversController {
  constructor(private readonly driversService: DriversService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new driver' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The driver has been successfully created.',
  })
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driversService.create(createDriverDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all drivers' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all drivers.' })
  findAll() {
    return this.driversService.findAll();
  }

  @Get('available')
  @ApiOperation({ summary: 'Get all available drivers' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all available drivers.' })
  findAvailable() {
    return this.driversService.findAvailableDrivers();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a driver by id' })
  @ApiParam({ name: 'id', description: 'Driver ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the driver.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Driver not found.' })
  findOne(@Param('id') id: string) {
    return this.driversService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a driver' })
  @ApiParam({ name: 'id', description: 'Driver ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The driver has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateDriverDto: UpdateDriverDto) {
    return this.driversService.update(id, updateDriverDto);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update driver status' })
  @ApiParam({ name: 'id', description: 'Driver ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The driver status has been successfully updated.' })
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateDriverStatusDto) {
    return this.driversService.updateStatus(id, updateStatusDto.status);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a driver' })
  @ApiParam({ name: 'id', description: 'Driver ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The driver has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.driversService.remove(id);
  }
}