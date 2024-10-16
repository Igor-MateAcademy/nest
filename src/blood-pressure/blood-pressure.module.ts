import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { AuthModule } from 'auth/auth.module'

import { BloodPressureService } from './blood-pressure.service'

import { BloodPressureController } from './blood-pressure.controller'

import { BloodPressure, BloodPressureSchema } from './schemas/blood-pressure.schema'
import { User, UserSchema } from 'user/schemas/user.schema'

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: BloodPressure.name, schema: BloodPressureSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [BloodPressureController],
  providers: [BloodPressureService],
})
export class BloodPressureModule {}
