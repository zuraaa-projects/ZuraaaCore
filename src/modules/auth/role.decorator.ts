import { CustomDecorator, SetMetadata } from '@nestjs/common'
import { RoleLevel } from './jwt.payload'

export const Roles = (role: RoleLevel): CustomDecorator<string> => SetMetadata('role', role)
