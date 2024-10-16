import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'

import { Request } from 'express'

import mongoose, { Model, RootFilterQuery } from 'mongoose'

import { BloodPressure } from './schemas/blood-pressure.schema'
import { User, UserDocument } from 'user/schemas/user.schema'

import { BloodPressureStatisticQueryParams } from './dto/blood-pressure-statistic-query.dto'
import { BloodPressureStatisticResponseDTO } from './dto/blood-pressure-statistic-response.dto'
import { CreateBloodPressureDto } from './dto/create-blood-pressure.dto'
import { BloodPressureQueryParams } from './dto/get-blood-pressure-query.dto'
import { UpdateBloodPressureDto } from './dto/update-blood-pressure.dto'

import { MongoId, SortOrder } from 'models'

@Injectable()
export class BloodPressureService {
  constructor(
    @InjectModel(BloodPressure.name)
    private bloodPressureModel: Model<BloodPressure>,
    @InjectModel(User.name)
    private userModel: Model<User>
  ) {}

  async create(dto: CreateBloodPressureDto, request: Request) {
    const record = new this.bloodPressureModel(dto)
    const userById = await this.userModel.findById(dto.user)
    const currentUser = request.user as UserDocument

    if (!userById) throw new HttpException('User not found', HttpStatus.NOT_FOUND)

    if (String(currentUser._id) === dto.user) {
      const createdRecord = await record.save()

      await userById.updateOne({
        $push: { pressure: createdRecord._id },
      })

      return createdRecord
    } else throw new ForbiddenException()
  }

  async findAll(query: BloodPressureQueryParams, request: Request) {
    const currentUser = request.user as UserDocument
    const options: RootFilterQuery<BloodPressure> = {
      user: String(currentUser._id),
    }

    if (query.from && query.to) {
      options.date = {
        $gte: query.from,
        $lte: query.to,
      }
    }

    const data = this.bloodPressureModel
      .find(options)
      .limit(Number(query.limit))
      .skip(Number(query.skip))

    if (query.sortBy) {
      data.sort({ [query.sortBy]: query.order || SortOrder.ASC })
    }

    return await data
  }

  async getStatistic(
    query: BloodPressureStatisticQueryParams,
    request: Request
  ): Promise<BloodPressureStatisticResponseDTO> {
    const currentUser = request.user as UserDocument

    const data = (await this.bloodPressureModel.aggregate([
      {
        $match: {
          user: String(currentUser._id),
          date: {
            $gte: query.from,
            $lte: query.to,
          },
        },
      },
      {
        $group: {
          _id: 'result',
          pulseAverage: { $avg: '$pulse' },
          pulseMin: { $min: '$pulse' },
          pulseMax: { $max: '$pulse' },
          systolicPressureAverage: { $avg: '$systolicPressure' },
          systolicPressureAverageMin: { $min: '$systolicPressure' },
          systolicPressureAverageMax: { $max: '$systolicPressure' },
          diastolicPressureAverage: { $avg: '$diastolicPressure' },
          diastolicPressureMin: { $min: '$diastolicPressure' },
          diastolicPressureMax: { $max: '$diastolicPressure' },
        },
      },
      {
        $project: {
          pulse: {
            average: '$pulseAverage',
            min: '$pulseMin',
            max: '$pulseMax',
          },
          systolicPressure: {
            average: '$systolicPressureAverage',
            min: '$systolicPressureAverageMin',
            max: '$systolicPressureAverageMax',
          },
          diastolicPressure: {
            average: '$diastolicPressureAverage',
            min: '$diastolicPressureMin',
            max: '$diastolicPressureMax',
          },
        },
      },
    ])) as (BloodPressureStatisticResponseDTO & {
      _id?: mongoose.Types.ObjectId
    })[]

    const result = data.at(0)

    if (!result)
      throw new HttpException('Enable to calculate statistic metrics', HttpStatus.I_AM_A_TEAPOT)

    delete result._id

    return result
  }

  async findOne(id: string, request: Request) {
    const currentUser = request.user as UserDocument
    const record = await this.bloodPressureModel.findById(id)

    if (!record) throw new HttpException('Blood Pressure data not found', HttpStatus.NOT_FOUND)

    if (String(currentUser._id) !== record.user) throw new ForbiddenException()

    return record
  }

  async update(id: MongoId, dto: UpdateBloodPressureDto, request: Request) {
    const currentUser = request.user as UserDocument

    if (!currentUser.pressure.includes(new mongoose.Types.ObjectId(id)))
      throw new ForbiddenException()

    const updatedRecord = this.bloodPressureModel.findByIdAndUpdate(id, dto, {
      new: true,
    })

    if (!updatedRecord) throw new HttpException('BloodPressure not found', HttpStatus.NOT_FOUND)

    return updatedRecord
  }

  async remove(id: string, request: Request) {
    const currentUser = request.user as UserDocument

    if (!currentUser.pressure.includes(new mongoose.Types.ObjectId(id)))
      throw new ForbiddenException()

    const removedRecord = await this.bloodPressureModel.findByIdAndDelete(id)

    if (!removedRecord)
      throw new HttpException('Blood Pressure data not found', HttpStatus.NOT_FOUND)

    const recordOwner = await this.userModel.findById(removedRecord.user)

    if (!recordOwner) {
      throw new NotFoundException('User not found')
    }

    await recordOwner.updateOne({
      _id: recordOwner._id,
      $pull: { pressure: removedRecord._id },
    })

    return removedRecord
  }
}
