import { Module } from '@nestjs/common';
import { YachtsService } from './yachts.service';
import { YachtsController } from './yachts.controller';

@Module({
  providers: [YachtsService],
  controllers: [YachtsController],
  exports: [YachtsService],
})
export class YachtsModule {}
