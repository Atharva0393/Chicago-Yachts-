import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { DestinationsModule } from './destinations/destinations.module';
import { YachtsModule } from './yachts/yachts.module';
import { BookingsModule } from './bookings/bookings.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AdminModule } from './admin/admin.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    DestinationsModule,
    YachtsModule,
    BookingsModule,
    ReviewsModule,
    AdminModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
