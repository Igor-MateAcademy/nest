import { NestMiddleware } from '@nestjs/common'

import { NextFunction, Request, Response } from 'express'

import Logger from 'logger'

export class LoggerMiddleware implements NestMiddleware {
  constructor() {}

  use(request: Request, response: Response, next: NextFunction) {
    const { method, originalUrl, body, query } = request

    Logger.info('='.repeat(120))
    Logger.info('')
    Logger.info({ method, url: originalUrl, body, query })
    Logger.info('')

    next()
  }
}
