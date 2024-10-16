import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'

import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'

import { AuthModule } from './auth/auth.module'
import { BloodPressureModule } from './blood-pressure/blood-pressure.module'
import { UserModule } from './user/user.module'

import { LoggerMiddleware } from './logger/middlewares/logger.middleware'

const { combine, timestamp, printf, colorize, errors } = winston.format

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://localhost/blood-pressure-app'),
    // WinstonModule.forRoot({
    //   level: 'info',
    //   transports: [
    //     new winston.transports.Console({
    //       format: combine(
    //         errors({ stack: true }),
    //         colorize(),
    //         timestamp({ format: 'DD MMM YYYY, HH:mm:ss' }),
    //         printf(info => {
    //           return `${info.timestamp} | [${info.level}]: ${info.message}`
    //         })
    //       ),
    //     }),
    //     new winston.transports.File({ filename: 'server.log' }),
    //   ],
    //   exceptionHandlers: [new winston.transports.File({ filename: 'exceptions.log' })],
    // }),
    AuthModule,
    UserModule,
    BloodPressureModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
