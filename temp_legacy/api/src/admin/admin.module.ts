import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { YachtsModule } from '../yachts/yachts.module';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
  imports: [YachtsModule, BookingsModule],
  providers: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
