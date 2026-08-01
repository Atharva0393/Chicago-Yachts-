import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryYachtsDto } from './dto/query-yachts.dto';
import { CreateYachtDto } from './dto/create-yacht.dto';
import { UpdateYachtDto } from './dto/update-yacht.dto';
import type { AuthUser } from '../common/types';

function slugify(title: string) {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') +
    '-' +
    Math.random().toString(36).slice(2, 7)
  );
}

const include = {
  destination: true,
  media: { orderBy: { sortOrder: 'asc' as const } },
  amenities: { include: { amenity: true } },
  packages: true,
  owner: {
    select: {
      id: true,
      name: true,
      createdAt: true,
      ownerProfile: { select: { verificationStatus: true } },
    },
  },
  reviews: {
    where: { status: 'published' },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: 'desc' as const },
  },
};

const summaryInclude = {
  destination: true,
  media: { orderBy: { sortOrder: 'asc' as const }, take: 1 },
  owner: { select: { ownerProfile: { select: { verificationStatus: true } } } },
};

@Injectable()
export class YachtsService {
  constructor(private prisma: PrismaService) {}

  async findAll(q: QueryYachtsDto) {
    const where: Record<string, unknown> = { status: 'live' };
    if (q.destination) where.destination = { slug: q.destination };
    if (q.type) where.type = q.type;
    if (q.maxPrice) where.pricePerHour = { lte: q.maxPrice };
    if (q.guests) where.capacity = { gte: q.guests };
    if (q.captainOnly === 'true') where.withCaptain = true;
    if (q.instantOnly === 'true') where.instantBook = true;

    const orderBy =
      q.sort === 'price-asc'
        ? { pricePerHour: 'asc' as const }
        : q.sort === 'price-desc'
          ? { pricePerHour: 'desc' as const }
          : q.sort === 'rating'
            ? { rating: 'desc' as const }
            : { bookingsCount: 'desc' as const };

    const data = await this.prisma.yacht.findMany({
      where,
      orderBy,
      include: summaryInclude,
    });
    return { data, total: data.length };
  }

  async findBySlug(slug: string) {
    const yacht = await this.prisma.yacht.findUnique({
      where: { slug },
      include,
    });
    if (!yacht) throw new NotFoundException('Yacht not found');
    return { data: yacht };
  }

  async findMine(owner: AuthUser) {
    const data = await this.prisma.yacht.findMany({
      where: { ownerId: owner.id },
      include: summaryInclude,
      orderBy: { createdAt: 'desc' },
    });
    return { data, total: data.length };
  }

  async create(owner: AuthUser, dto: CreateYachtDto) {
    const destination = await this.prisma.destination.findUnique({
      where: { slug: dto.destinationSlug },
    });
    if (!destination) throw new NotFoundException('Destination not found');

    const yacht = await this.prisma.yacht.create({
      data: {
        slug: slugify(dto.title),
        ownerId: owner.id,
        destinationId: destination.id,
        title: dto.title,
        type: dto.type,
        marina: dto.marina,
        lengthFt: dto.lengthFt,
        capacity: dto.capacity,
        cabins: dto.cabins ?? 0,
        crew: dto.crew ?? 0,
        withCaptain: dto.withCaptain ?? true,
        instantBook: dto.instantBook ?? false,
        description: dto.description,
        pricePerHour: dto.pricePerHour,
        minHours: dto.minHours ?? 2,
        currency: dto.currency,
        status: 'pending', // enters the admin moderation queue
        media: { create: dto.images.map((url, i) => ({ url, sortOrder: i })) },
        ...(dto.amenities?.length
          ? {
              amenities: {
                create: dto.amenities.map((name) => ({
                  amenity: {
                    connectOrCreate: { where: { name }, create: { name } },
                  },
                })),
              },
            }
          : {}),
      },
      include,
    });
    return { data: yacht };
  }

  async update(owner: AuthUser, slug: string, dto: UpdateYachtDto) {
    const yacht = await this.prisma.yacht.findUnique({ where: { slug } });
    if (!yacht) throw new NotFoundException('Yacht not found');
    if (yacht.ownerId !== owner.id && owner.role !== 'admin') {
      throw new ForbiddenException('You do not own this listing');
    }

    // destinationSlug/images/amenities aren't yet supported on update — Prisma's
    // update `data` shape can't take them directly — so they're excluded from `rest`.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { destinationSlug, images, amenities, ...rest } = dto;
    const updated = await this.prisma.yacht.update({
      where: { slug },
      data: {
        ...rest,
        // editing a live listing sends it back for re-review, matching the
        // admin moderation flow described in the platform's admin module docs
        status: yacht.status === 'live' ? 'pending' : yacht.status,
      },
      include,
    });
    return { data: updated };
  }

  // --- Admin moderation ---

  async setStatus(slug: string, status: 'live' | 'rejected' | 'paused') {
    const yacht = await this.prisma.yacht.findUnique({ where: { slug } });
    if (!yacht) throw new NotFoundException('Yacht not found');
    const updated = await this.prisma.yacht.update({
      where: { slug },
      data: { status },
    });
    return { data: updated };
  }

  async findPending() {
    const data = await this.prisma.yacht.findMany({
      where: { status: 'pending' },
      include,
      orderBy: { createdAt: 'asc' },
    });
    return { data, total: data.length };
  }
}
