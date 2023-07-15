import { Type, Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class PaginationQuery {
  @IsOptional()
  players?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  limit?: number;

  @IsOptional()
  @IsEnum(SortOrder)
  sort: SortOrder = SortOrder.ASC;

  @IsOptional()
  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate: string;
}
