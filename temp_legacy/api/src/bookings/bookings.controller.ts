import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types';

@ApiTags('bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('v1/bookings')
export class BookingsController {
  constructor(private bookings: BookingsService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateBookingDto) {
    return this.bookings.create(user, dto);
  }

  @Get('mine')
  findMine(@CurrentUser() user: AuthUser) {
    return this.bookings.findMine(user);
  }

  @Get('owner')
  @UseGuards(RolesGuard)
  @Roles('owner')
  findForOwner(@CurrentUser() user: AuthUser) {
    return this.bookings.findForOwner(user);
  }

  @Patch(':id/approve')
  @UseGuards(RolesGuard)
  @Roles('owner')
  approve(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.bookings.decide(user, id, 'approve');
  }

  @Patch(':id/reject')
  @UseGuards(RolesGuard)
  @Roles('owner')
  reject(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.bookings.decide(user, id, 'reject');
  }

  @Patch(':id/cancel')
  cancel(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.bookings.cancel(user, id);
  }
}
