import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import mongoose from 'mongoose'

import { MongoId } from 'models'

@Schema({
  timestamps: true,
  versionKey: false,
})
export class BloodPressure {
  @Prop({ required: true })
  pulse: number

  @Prop({ required: true })
  diastolicPressure: number

  @Prop({ required: true })
  systolicPressure: number

  @Prop({ required: true })
  user: string

  @Prop({ required: true })
  date: string
}

export const BloodPressureSchema = SchemaFactory.createForClass(BloodPressure)
