import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { Request } from 'express'

import { BloodPressureService } from './blood-pressure.service'

import { Roles } from 'auth/decorators/roles.decorator'

import { RolesGuard } from 'auth/guards/roles.guard'

import { BloodPressureStatisticQueryParams } from './dto/blood-pressure-statistic-query.dto'
import { CreateBloodPressureDto } from './dto/create-blood-pressure.dto'
import { BloodPressureQueryParams } from './dto/get-blood-pressure-query.dto'
import { UpdateBloodPressureDto } from './dto/update-blood-pressure.dto'

import { UserRole } from 'user/enums/roles.enum'

import { MongoIdPipe } from 'common/pipes/MongoIdPipe.pipe'

import { MongoId } from 'models'

@ApiBearerAuth(process.env.JWT_AUTH_NAME)
@ApiTags('BloodPressure')
@Controller('blood-pressure')
export class BloodPressureController {
  constructor(private readonly bloodPressureService: BloodPressureService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(AuthGuard())
  @Post()
  create(@Req() request: Request, @Body() dto: CreateBloodPressureDto) {
    return this.bloodPressureService.create(dto, request)
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(AuthGuard())
  @Get()
  findAll(@Req() request: Request, @Query() query: BloodPressureQueryParams) {
    return this.bloodPressureService.findAll(query, request)
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(AuthGuard())
  @Get('statistic')
  getStatistic(@Req() request: Request, @Query() query: BloodPressureStatisticQueryParams) {
    return this.bloodPressureService.getStatistic(query, request)
  }

  @UsePipes(MongoIdPipe)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(AuthGuard())
  @Get(':id')
  findOne(@Req() request: Request, @Param('id') id: string) {
    return this.bloodPressureService.findOne(id, request)
  }

  @UsePipes(MongoIdPipe)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(AuthGuard())
  @Patch(':id')
  update(@Req() request: Request, @Param('id') id: MongoId, @Body() dto: UpdateBloodPressureDto) {
    return this.bloodPressureService.update(id, dto, request)
  }

  @UsePipes(MongoIdPipe)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseGuards(AuthGuard())
  @Delete(':id')
  remove(@Req() request: Request, @Param('id') id: string) {
    return this.bloodPressureService.remove(id, request)
  }
}
