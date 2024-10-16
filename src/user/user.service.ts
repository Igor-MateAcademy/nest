import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { Request } from 'express'

import mongoose, { Model, RootFilterQuery } from 'mongoose'

import { User } from './schemas/user.schema'

import { CreateUserDto } from './dto/create-user.dto'
import { GetUsersResponseDTO } from './dto/get-users-response.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UsersQueryParams } from './dto/users-query.dto'

import { UserRole } from './enums/roles.enum'

import { SortOrder } from 'models'

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto)

    return await newUser.save()
  }

  async findAll(query: UsersQueryParams) {
    const options: RootFilterQuery<User> = {}

    if (!!query.ids?.length) {
      const ids = Array.isArray(query.ids) ? query.ids : Array(query.ids)

      options._id = {
        $in: ids.filter(id => mongoose.Types.ObjectId.isValid(id)),
      }
    }

    if (!!query.roles?.length) {
      const roles = Array.isArray(query.roles) ? query.roles : Array(query.roles)

      options.role = {
        $in: roles,
      }
    }

    if (!!query.sex?.length) {
      const sex = Array.isArray(query.sex) ? query.sex : Array(query.sex)

      options.sex = {
        $in: sex,
      }
    }

    const users = this.userModel.find(options).limit(Number(query.limit)).skip(Number(query.skip))

    if (query.sortBy) {
      users.sort({ [query.sortBy]: query.order || SortOrder.ASC })
    }

    return await users
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id)

    if (!user) throw new HttpException('The user not found', HttpStatus.NOT_FOUND)

    return user
  }

  async updatePartialUser(id: string, dto: UpdateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, dto, {
      new: true,
    })

    if (!updatedUser) throw new HttpException('The user not found', HttpStatus.NOT_FOUND)

    return updatedUser
  }

  async update(id: string, dto: UpdateUserDto, request: Request) {
    const userFromRequest = request.user as GetUsersResponseDTO
    const isItselfUpdate = String(userFromRequest._id) === id

    if (userFromRequest.role === UserRole.ADMIN) {
      return await this.updatePartialUser(id, dto)
    } else {
      if (isItselfUpdate) {
        return await this.updatePartialUser(id, dto)
      } else {
        throw new ForbiddenException('You are not allowed to update other users')
      }
    }
  }

  async remove(id: string, request: Request) {
    const userFromRequest = request.user as GetUsersResponseDTO

    if (String(userFromRequest._id) === id)
      throw new HttpException('You can not delete yourself', HttpStatus.BAD_REQUEST)

    const removedUser = await this.userModel.findByIdAndDelete(id)

    if (!removedUser) throw new HttpException('The user not found', HttpStatus.NOT_FOUND)

    return removedUser
  }
}
