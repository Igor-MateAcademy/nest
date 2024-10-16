import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { AuthModule } from 'auth/auth.module'

import { UserService } from './user.service'

import { UserController } from './user.controller'

import { User, UserSchema } from './schemas/user.schema'

@Module({
  imports: [AuthModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
