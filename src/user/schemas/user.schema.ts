import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

import { HydratedDocument } from 'mongoose'

import { UserRole } from '../enums/roles.enum'

import { MongoId } from 'models'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true })
  fullName: string

  @Prop({ required: true })
  birthday: string

  @Prop({ required: true })
  sex: 'male' | 'female'

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ default: UserRole.USER })
  role: UserRole

  @Prop({
    default: [],
  })
  pressure: MongoId[]
}

export const UserSchema = SchemaFactory.createForClass(User)
