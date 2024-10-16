import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'

import { plainToInstance } from 'class-transformer'
import { map } from 'rxjs'

import { GetUsersResponseDTO } from '../dto/get-users-response.dto'

// TODO: Implement serialization
@Injectable()
export class UserInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, handler: CallHandler) {
    return handler.handle().pipe(
      map((data: GetUsersResponseDTO | GetUsersResponseDTO[]) => {
        if (Array.isArray(data)) {
          const users = plainToInstance(GetUsersResponseDTO, data, {
            excludeExtraneousValues: true,
          })

          data.map((user, index) => {
            users[index]._id = user._id
            users[index].pressure = user.pressure
          })

          return users
        } else {
          const user = plainToInstance(GetUsersResponseDTO, data, {
            excludeExtraneousValues: true,
          })

          user._id = data._id
          user.pressure = data.pressure

          return user
        }
      })
    )
  }
}
