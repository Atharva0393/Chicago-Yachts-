import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { AdminService } from './admin.service';
import { BookingsService } from '../bookings/bookings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

class SetUserStatusDto {
  @IsIn(['active', 'suspended', 'flagged'])
  status!: 'active' | 'suspended' | 'flagged';
}

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'manager', 'support')
@Controller('v1/admin')
export class AdminController {
  constructor(
    private admin: AdminService,
    private bookings: BookingsService,
  ) {}

  @Get('overview')
  @Roles('admin', 'manager')
  overview() {
    return this.admin.overview();
  }

  @Get('listings/pending')
  pendingListings() {
    return this.admin.findPendingListings();
  }

  @Patch('listings/:slug/approve')
  @Roles('admin', 'manager')
  approveListing(@Param('slug') slug: string) {
    return this.admin.approveListing(slug);
  }

  @Patch('listings/:slug/reject')
  @Roles('admin', 'manager')
  rejectListing(@Param('slug') slug: string) {
    return this.admin.rejectListing(slug);
  }

  @Get('users')
  findUsers() {
    return this.admin.findUsers();
  }

  @Patch('users/:id/status')
  @Roles('admin', 'manager')
  setUserStatus(@Param('id') id: string, @Body() dto: SetUserStatusDto) {
    return this.admin.setUserStatus(id, dto.status);
  }

  @Get('bookings')
  allBookings() {
    return this.bookings.findAllForAdmin();
  }

  @Get('support-tickets')
  supportTickets() {
    return this.admin.findSupportTickets();
  }
}
