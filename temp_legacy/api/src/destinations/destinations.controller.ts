import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DestinationsService } from './destinations.service';

@ApiTags('destinations')
@Controller('v1/destinations')
export class DestinationsController {
  constructor(private destinations: DestinationsService) {}

  @Get()
  findAll() {
    return this.destinations.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.destinations.findBySlug(slug);
  }
}
