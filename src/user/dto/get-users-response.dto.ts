import { Exclude, Expose } from 'class-transformer'
import * as mongoose from 'mongoose'

import { UserRole } from '../enums/roles.enum'
import { Sex } from '../enums/sex.enum'

import { MongoId } from 'models'

export class GetUsersResponseDTO {
  @Expose()
  _id: MongoId

  @Expose()
  fullName: string

  @Expose()
  birthday: string

  @Expose()
  sex: Sex

  @Expose()
  email: string

  @Expose()
  createdAt: string

  @Expose()
  updatedAt: string

  @Expose()
  role: UserRole

  @Expose()
  pressure: MongoId[]

  @Exclude()
  password: string
}
