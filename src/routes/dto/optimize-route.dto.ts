import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class OptimizeRouteDto {
  @ApiProperty({ description: 'Array of order IDs to optimize' })
  @IsArray()
  @IsString({ each: true })
  orderIds: string[];
}