import { Transform } from 'class-transformer'
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'
import mongoose from 'mongoose'

import { UserRole } from '../enums/roles.enum'
import { Sex } from '../enums/sex.enum'

import { MongoId, SortOrder } from 'models'

export enum UsersSortBy {
  FULL_NAME = 'fullName',
  BIRTHDAY = 'birthday',
}

export class UsersQueryParams {
  @IsOptional()
  @Transform(({ value }) => Array(value))
  @IsArray()
  ids?: MongoId[]

  @IsOptional()
  @Transform(({ value }) => Array(value))
  @IsArray()
  roles?: UserRole[]

  @IsOptional()
  @Transform(({ value }) => Array(value))
  @IsArray()
  sex?: Sex[]

  @IsOptional()
  @IsString()
  @IsDateString()
  from?: string

  @IsOptional()
  @IsString()
  @IsDateString()
  to?: string

  @IsOptional()
  @IsEnum(UsersSortBy)
  sortBy?: UsersSortBy

  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder

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
