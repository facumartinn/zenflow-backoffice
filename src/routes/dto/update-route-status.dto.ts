import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RouteStatus } from '@prisma/client';

export class UpdateRouteStatusDto {
  @ApiProperty({ enum: RouteStatus, description: 'The status of the route' })
  @IsEnum(RouteStatus)
  status: RouteStatus;
}