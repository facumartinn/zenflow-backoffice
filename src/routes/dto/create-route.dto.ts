import { IsString, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRouteDto {
  @ApiProperty({ description: 'Driver ID' })
  @IsString()
  driverId: string;

  @ApiProperty({ description: 'Array of order IDs to include in the route' })
  @IsArray()
  @IsString({ each: true })
  orderIds: string[];
}