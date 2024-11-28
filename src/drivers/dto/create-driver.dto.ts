import { IsString, IsEmail, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDriverDto {
  @ApiProperty({ example: 'John Doe', description: 'The full name of the driver' })
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'DL123456', description: 'The license number of the driver' })
  @IsString()
  licenseNumber: string;

  @ApiProperty({ example: '+1234567890', description: 'The phone number of the driver' })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({ example: 'john@example.com', description: 'The email of the driver' })
  @IsEmail()
  email: string;
}