import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common'

import Logger from 'logger'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const context = host.switchToHttp()
    const response = context.getResponse()
    const request = context.getRequest()
    const status = exception.getStatus?.() || HttpStatus.INTERNAL_SERVER_ERROR

    const exceptionResponse = {
      status,
      method: request.method,
      path: request.url,
      error: exception.response,
    }

    response.status(status).json(exceptionResponse)
    Logger.error({
      ...exceptionResponse.error,
      method: request.method,
      body: request.body,
      query: request.query,
      url: request.originalUrl,
    })
  }
}
