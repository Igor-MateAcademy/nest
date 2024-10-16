import { StatisticData } from 'models'

export class BloodPressureStatisticResponseDTO {
  pulse: StatisticData
  systolicPressure: StatisticData
  diastolicPressure: StatisticData
}
