import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../user/enums/roles.enum';

export const ROLE_KEY = 'role';
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLE_KEY, roles);
