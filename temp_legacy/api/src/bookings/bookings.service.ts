import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import type { AuthUser } from '../common/types';

const SERVICE_FEE_RATE = 0.1;

function genCode() {
  return `BLY-${Math.floor(20000 + Math.random() * 80000)}`;
}

const include = {
  yacht: {
    select: {
      title: true,
      slug: true,
      currency: true,
      instantBook: true,
      ownerId: true,
      destination: { select: { name: true } },
      media: { orderBy: { sortOrder: 'asc' as const }, take: 1 },
    },
  },
  customer: { select: { name: true, email: true } },
};

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  async create(customer: AuthUser, dto: CreateBookingDto) {
    const yacht = await this.prisma.yacht.findUnique({
      where: { slug: dto.yachtSlug },
    });
    if (!yacht || yacht.status !== 'live') {
      throw new NotFoundException('Yacht not available for booking');
    }
    if (dto.guests > yacht.capacity) {
      throw new BadRequestException(
        `This yacht holds a maximum of ${yacht.capacity} guests`,
      );
    }
    if (dto.hours < yacht.minHours) {
      throw new BadRequestException(
        `Minimum charter length is ${yacht.minHours} hours`,
      );
    }

    const date = new Date(dto.date);

    // Overlap check — MVP-level guard against double-booking the same yacht/day.
    // Production on Postgres upgrades this to a DB-level exclusion constraint on
    // (yachtId, date, time-range) so it holds under concurrent requests too.
    const clash = await this.prisma.booking.findFirst({
      where: {
        yachtId: yacht.id,
        date,
        status: { in: ['pending', 'approved', 'paid', 'confirmed'] },
      },
    });
    if (clash) {
      throw new BadRequestException(
        'This yacht is already booked for that date',
      );
    }

    const subtotal = yacht.pricePerHour * dto.hours;
    const fees = Math.round(subtotal * SERVICE_FEE_RATE);
    const total = subtotal + fees;
    const status = yacht.instantBook ? 'confirmed' : 'pending';

    const booking = await this.prisma.booking.create({
      data: {
        code: genCode(),
        yachtId: yacht.id,
        customerId: customer.id,
        date,
        startTime: dto.startTime,
        hours: dto.hours,
        guests: dto.guests,
        status,
        subtotal,
        fees,
        total,
        currency: yacht.currency,
      },
      include,
    });

    await this.prisma.yacht.update({
      where: { id: yacht.id },
      data: { bookingsCount: { increment: 1 } },
    });

    // Payment stub — swapped for a real Stripe PaymentIntent in phase 2
    // (see docs/ARCHITECTURE.md §5, Stripe Connect money flow).
    await this.prisma.payment.create({
      data: {
        bookingId: booking.id,
        kind: 'charge',
        amount: total,
        status: status === 'confirmed' ? 'succeeded' : 'pending',
      },
    });

    return { data: booking };
  }

  async findMine(customer: AuthUser) {
    const data = await this.prisma.booking.findMany({
      where: { customerId: customer.id },
      include,
      orderBy: { date: 'desc' },
    });
    return { data, total: data.length };
  }

  async findForOwner(owner: AuthUser) {
    const data = await this.prisma.booking.findMany({
      where: { yacht: { ownerId: owner.id } },
      include,
      orderBy: { createdAt: 'desc' },
    });
    return { data, total: data.length };
  }

  async findAllForAdmin() {
    const data = await this.prisma.booking.findMany({
      include,
      orderBy: { createdAt: 'desc' },
    });
    return { data, total: data.length };
  }

  async decide(owner: AuthUser, id: string, action: 'approve' | 'reject') {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { yacht: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.yacht.ownerId !== owner.id && owner.role !== 'admin') {
      throw new ForbiddenException('Not your listing');
    }
    if (booking.status !== 'pending') {
      throw new BadRequestException(
        'Only pending bookings can be approved or rejected',
      );
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status: action === 'approve' ? 'approved' : 'cancelled' },
      include,
    });
    return { data: updated };
  }

  async cancel(user: AuthUser, id: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.customerId !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('Not your booking');
    }
    if (
      !['pending', 'approved', 'paid', 'confirmed'].includes(booking.status)
    ) {
      throw new BadRequestException(
        'Booking cannot be cancelled in its current state',
      );
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status: 'cancelled' },
      include,
    });
    return { data: updated };
  }
}
