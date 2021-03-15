import { Length, IsOptional } from 'class-validator'

export default class UserDto {
  @IsOptional()
  @Length(1, 255)
  bio?: string
}
