import { Transform } from 'class-transformer'
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

import { SortOrder } from 'models'

export enum BloodPressureSortBy {
  PULSE = 'pulse',
  DIASTOLIC_PRESSURE = 'diastolicPressure',
  SYSTOLIC_PRESSURE = 'systolicPressure',
}

export class BloodPressureQueryParams {
  @IsOptional()
  @IsEnum(BloodPressureSortBy)
  sortBy?: BloodPressureSortBy

  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder

  @IsOptional()
  @IsString()
  @IsDateString()
  from?: string

  @IsOptional()
  @IsString()
  @IsDateString()
  to?: string

  @Transform(({ value }) => Number(value))
  @Min(0)
  @IsNotEmpty()
  @IsNumber()
  limit: string

  @Transform(({ value }) => Number(value))
  @Min(0)
  @IsNotEmpty()
  @IsNumber()
  skip: string
}
