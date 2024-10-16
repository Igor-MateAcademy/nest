import mongoose from 'mongoose'

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export type StatisticData = {
  average: number
  min: number
  max: number
}

export type MongoId = mongoose.Types.ObjectId
