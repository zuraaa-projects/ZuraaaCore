import { SetMetadata } from '@nestjs/common'
import { RoleLevel } from './jwt.payload'

export const Roles = (role: RoleLevel) => SetMetadata('role', role)