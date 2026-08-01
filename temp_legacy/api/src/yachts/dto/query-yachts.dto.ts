import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

const TYPES = [
  'Motor Yacht',
  'Mega Yacht',
  'Sailing Yacht',
  'Catamaran',
  'Speedboat',
  'Houseboat',
];

export class QueryYachtsDto {
  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsIn(TYPES)
  type?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  guests?: number;

  @IsOptional()
  @IsIn(['true', 'false'])
  captainOnly?: string;

  @IsOptional()
  @IsIn(['true', 'false'])
  instantOnly?: string;

  @IsOptional()
  @IsIn(['recommended', 'price-asc', 'price-desc', 'rating'])
  sort?: string;
}
