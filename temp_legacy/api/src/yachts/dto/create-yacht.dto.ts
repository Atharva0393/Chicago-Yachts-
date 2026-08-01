import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

const TYPES = [
  'Motor Yacht',
  'Mega Yacht',
  'Sailing Yacht',
  'Catamaran',
  'Speedboat',
  'Houseboat',
];

export class CreateYachtDto {
  @IsString()
  @MinLength(3)
  title!: string;

  @IsIn(TYPES)
  type!: string;

  @IsString()
  destinationSlug!: string;

  @IsString()
  marina!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  lengthFt!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  cabins?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  crew?: number;

  @IsOptional()
  @IsBoolean()
  withCaptain?: boolean;

  @IsOptional()
  @IsBoolean()
  instantBook?: boolean;

  @IsString()
  @MinLength(20)
  description!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pricePerHour!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  minHours?: number;

  @IsString()
  currency!: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  images!: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenities?: string[];
}
