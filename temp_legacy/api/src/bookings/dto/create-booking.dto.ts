import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Matches, Min } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  yachtSlug!: string;

  @IsOptional()
  @IsString()
  packageId?: string;

  // ISO date, e.g. "2026-08-02"
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  date!: string;

  // "HH:mm"
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/)
  startTime!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  hours!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  guests!: number;
}
