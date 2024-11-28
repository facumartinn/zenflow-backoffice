import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '@prisma/client';

export class UpdateDriverStatusDto {
  @ApiProperty({ enum: Status, description: 'The status of the driver' })
  @IsEnum(Status)
  status: Status;
}