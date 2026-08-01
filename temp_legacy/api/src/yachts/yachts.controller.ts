import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { YachtsService } from './yachts.service';
import { QueryYachtsDto } from './dto/query-yachts.dto';
import { CreateYachtDto } from './dto/create-yacht.dto';
import { UpdateYachtDto } from './dto/update-yacht.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthUser } from '../common/types';

@ApiTags('yachts')
@Controller('v1/yachts')
export class YachtsController {
  constructor(private yachts: YachtsService) {}

  @Get()
  findAll(@Query() query: QueryYachtsDto) {
    return this.yachts.findAll(query);
  }

  @Get('mine')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  findMine(@CurrentUser() user: AuthUser) {
    return this.yachts.findMine(user);
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.yachts.findBySlug(slug);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateYachtDto) {
    return this.yachts.create(user, dto);
  }

  @Patch(':slug')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('owner')
  update(
    @CurrentUser() user: AuthUser,
    @Param('slug') slug: string,
    @Body() dto: UpdateYachtDto,
  ) {
    return this.yachts.update(user, slug, dto);
  }
}
