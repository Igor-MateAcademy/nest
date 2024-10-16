import { ApiProperty } from '@nestjs/swagger'

import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator'

import { Sex } from '../enums/sex.enum'

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  fullName: string

  @ApiProperty({ description: 'ISO 8601 date string' })
  @IsNotEmpty()
  @IsDateString()
  birthday: string

  @ApiProperty({ type: 'enum', enum: Sex })
  @IsNotEmpty()
  @IsEnum(Sex)
  sex: Sex

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail({}, { message: 'Email is invalid' })
  email: string
}
