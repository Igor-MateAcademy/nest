import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { Request } from 'express'

import Logger from 'logger'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'

// import { Logger } from 'winston'
import { UserService } from './user.service'

import { Roles } from 'auth/decorators/roles.decorator'

import { UserInterceptor } from './interceptors/user.interceptor'

import { RolesGuard } from 'auth/guards/roles.guard'

import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UsersQueryParams } from './dto/users-query.dto'

import { UserRole } from './enums/roles.enum'

import { MongoIdPipe } from 'common/pipes/MongoIdPipe.pipe'

@ApiBearerAuth(process.env.JWT_AUTH_NAME)
@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @UseInterceptors(UserInterceptor)
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  @Get()
  @UseInterceptors(UserInterceptor)
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard())
  findAll(@Query() query: UsersQueryParams) {
    return this.userService.findAll(query)
  }

  @Get('me')
  @UseInterceptors(UserInterceptor)
  @UseGuards(AuthGuard())
  me(@Req() request: Request) {
    const authorizedUser = request.user

    if (!authorizedUser) throw new UnauthorizedException()

    return authorizedUser
  }

  @UsePipes(MongoIdPipe)
  @Get(':id')
  @UseInterceptors(UserInterceptor)
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard())
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id)
  }

  @UsePipes(MongoIdPipe)
  @Patch(':id')
  @UseInterceptors(UserInterceptor)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard())
  update(@Req() request: Request, @Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto, request)
  }

  @UsePipes(MongoIdPipe)
  @Delete(':id')
  @UseInterceptors(UserInterceptor)
  @Roles(UserRole.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard())
  remove(@Req() request: Request, @Param('id') id: string) {
    return this.userService.remove(id, request)
  }
}
