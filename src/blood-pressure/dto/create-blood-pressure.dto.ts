import { ApiProperty } from '@nestjs/swagger'

import { IsDateString, IsMongoId, IsNotEmpty, IsNumber, Min } from 'class-validator'

export class CreateBloodPressureDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  pulse: number

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  diastolicPressure: number

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  systolicPressure: number

  @ApiProperty()
  @IsNotEmpty()
  @IsMongoId()
  user: string

  @ApiProperty({ description: 'ISO 8601 date string' })
  @IsNotEmpty()
  @IsDateString()
  date: string
}
