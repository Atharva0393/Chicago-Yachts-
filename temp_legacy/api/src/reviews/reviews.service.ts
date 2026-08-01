import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import type { AuthUser } from '../common/types';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(user: AuthUser, dto: CreateReviewDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
    });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.customerId !== user.id)
      throw new ForbiddenException('Not your booking');
    if (booking.status !== 'completed') {
      throw new BadRequestException('You can only review completed trips');
    }

    const review = await this.prisma.review.create({
      data: {
        bookingId: booking.id,
        authorId: user.id,
        yachtId: booking.yachtId,
        ratingOverall: dto.ratingOverall,
        ratingAccuracy: dto.ratingAccuracy,
        ratingValue: dto.ratingValue,
        ratingComms: dto.ratingComms,
        comment: dto.comment,
      },
    });

    // recompute the yacht's aggregate rating
    const agg = await this.prisma.review.aggregate({
      where: { yachtId: booking.yachtId, status: 'published' },
      _avg: { ratingOverall: true },
      _count: true,
    });
    await this.prisma.yacht.update({
      where: { id: booking.yachtId },
      data: {
        rating: Math.round((agg._avg.ratingOverall ?? 0) * 10) / 10,
        reviewCount: agg._count,
      },
    });

    return { data: review };
  }

  async findForYacht(yachtSlug: string) {
    const yacht = await this.prisma.yacht.findUnique({
      where: { slug: yachtSlug },
    });
    if (!yacht) throw new NotFoundException('Yacht not found');
    const data = await this.prisma.review.findMany({
      where: { yachtId: yacht.id, status: 'published' },
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return { data, total: data.length };
  }
}
