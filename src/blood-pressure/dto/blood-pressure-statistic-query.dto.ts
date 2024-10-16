import { IsDateString, IsNotEmpty } from 'class-validator'

export class BloodPressureStatisticQueryParams {
  @IsNotEmpty()
  @IsDateString()
  from: string

  @IsNotEmpty()
  @IsDateString()
  to: string
}
