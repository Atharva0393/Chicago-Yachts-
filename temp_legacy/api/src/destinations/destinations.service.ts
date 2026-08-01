import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DestinationsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const data = await this.prisma.destination.findMany({
      orderBy: { featured: 'desc' },
      include: { _count: { select: { yachts: true } } },
    });
    return { data, total: data.length };
  }

  async findBySlug(slug: string) {
    const dest = await this.prisma.destination.findUnique({ where: { slug } });
    if (!dest) throw new NotFoundException('Destination not found');
    return { data: dest };
  }
}
