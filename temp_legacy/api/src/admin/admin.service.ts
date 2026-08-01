import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { YachtsService } from '../yachts/yachts.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private yachts: YachtsService,
  ) {}

  async overview() {
    const [users, yachts, liveYachts, pendingYachts, bookings, gmvAgg] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.yacht.count(),
        this.prisma.yacht.count({ where: { status: 'live' } }),
        this.prisma.yacht.count({ where: { status: 'pending' } }),
        this.prisma.booking.count(),
        this.prisma.booking.aggregate({
          _sum: { total: true },
          where: { status: { in: ['paid', 'confirmed', 'completed'] } },
        }),
      ]);
    return {
      data: {
        users,
        yachts,
        liveYachts,
        pendingYachts,
        bookings,
        gmv: gmvAgg._sum.total ?? 0,
      },
    };
  }

  findPendingListings() {
    return this.yachts.findPending();
  }

  approveListing(slug: string) {
    return this.yachts.setStatus(slug, 'live');
  }

  rejectListing(slug: string) {
    return this.yachts.setStatus(slug, 'rejected');
  }

  async findUsers() {
    const data = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        _count: { select: { bookings: true, yachts: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return { data, total: data.length };
  }

  async setUserStatus(id: string, status: 'active' | 'suspended' | 'flagged') {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    const updated = await this.prisma.user.update({
      where: { id },
      data: { status },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safe } = updated;
    return { data: safe };
  }

  async findSupportTickets() {
    const data = await this.prisma.supportTicket.findMany({
      include: {
        user: { select: { name: true, email: true } },
        assignee: { select: { name: true } },
        booking: { select: { code: true } },
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });
    return { data, total: data.length };
  }
}
