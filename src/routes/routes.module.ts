import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { DriversModule } from '../drivers/drivers.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [DriversModule, OrdersModule],
  controllers: [RoutesController],
  providers: [RoutesService],
  exports: [RoutesService],
})
export class RoutesModule {}