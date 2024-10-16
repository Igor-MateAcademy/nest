import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { ROLE_KEY } from '../decorators/roles.decorator'

import { UserRole } from 'user/enums/roles.enum'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(ROLE_KEY, context.getHandler())

    if (!requiredRoles) {
      return true
    }

    const { user } = context.switchToHttp().getRequest()

    if (!user) throw new ForbiddenException('Unable to get user from token to check the role')

    const isAllow = requiredRoles.includes(user.role)

    return isAllow
  }
}
