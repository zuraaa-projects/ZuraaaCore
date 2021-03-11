import { Type } from 'class-transformer'
import { IsOptional, ValidateNested } from 'class-validator'
import UpdateUserDetailDto from './update-user-details.dto'

export default class UpdateUserDto {
  @IsOptional()
  banned!: boolean

  @IsOptional()
  banReason!: string

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateUserDetailDto)
  details!: UpdateUserDetailDto
}
