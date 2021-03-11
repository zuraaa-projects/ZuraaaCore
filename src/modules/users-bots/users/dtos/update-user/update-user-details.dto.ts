import { IsEnum, IsOptional } from 'class-validator'
import { RoleLevel } from 'src/modules/auth/jwt.payload'

export default class UpdateUserDetailDto {
  @IsEnum(RoleLevel)
  @IsOptional()
  role!: number
}
