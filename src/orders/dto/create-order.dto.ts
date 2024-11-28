import { IsString, IsNumber, IsObject, IsLatitude, IsLongitude } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty({ example: 'John Smith', description: 'Customer name' })
  @IsString()
  customerName: string;

  @ApiProperty({ example: '+1234567890', description: 'Customer phone number' })
  @IsString()
  customerPhone: string;

  @ApiProperty({ example: '123 Main St, City, Country', description: 'Delivery address' })
  @IsString()
  deliveryAddress: string;

  @ApiProperty({
    example: { items: [{ id: 1, name: 'Product 1', quantity: 2 }] },
    description: 'Order products',
  })
  @IsObject()
  products: any;

  @ApiProperty({ example: 40.7128, description: 'Delivery location latitude' })
  @IsLatitude()
  latitude: number;

  @ApiProperty({ example: -74.0060, description: 'Delivery location longitude' })
  @IsLongitude()
  longitude: number;
}