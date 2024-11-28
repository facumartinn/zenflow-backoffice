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
import { RoutesService } from './routes.service';
import { CreateRouteDto } from './dto/create-route.dto';
import { UpdateRouteDto } from './dto/update-route.dto';
import { UpdateRouteStatusDto } from './dto/update-route-status.dto';
import { OptimizeRouteDto } from './dto/optimize-route.dto';
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

@ApiTags('routes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new route' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The route has been successfully created.',
  })
  create(@Body() createRouteDto: CreateRouteDto) {
    return this.routesService.create(createRouteDto);
  }

  @Post('optimize')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Optimize route for given orders' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns optimized order sequence.',
  })
  optimizeRoute(@Body() optimizeRouteDto: OptimizeRouteDto) {
    return this.routesService.optimizeRoute(optimizeRouteDto.orderIds);
  }

  @Get()
  @ApiOperation({ summary: 'Get all routes' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all routes.' })
  findAll() {
    return this.routesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a route by id' })
  @ApiParam({ name: 'id', description: 'Route ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the route.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Route not found.' })
  findOne(@Param('id') id: string) {
    return this.routesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update a route' })
  @ApiParam({ name: 'id', description: 'Route ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The route has been successfully updated.' })
  update(@Param('id') id: string, @Body() updateRouteDto: UpdateRouteDto) {
    return this.routesService.update(id, updateRouteDto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update route status' })
  @ApiParam({ name: 'id', description: 'Route ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The route status has been successfully updated.' })
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateRouteStatusDto) {
    return this.routesService.updateStatus(id, updateStatusDto.status);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete a route' })
  @ApiParam({ name: 'id', description: 'Route ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'The route has been successfully deleted.' })
  remove(@Param('id') id: string) {
    return this.routesService.remove(id);
  }
}