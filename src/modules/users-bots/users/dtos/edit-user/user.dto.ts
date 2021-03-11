import { Length } from 'class-validator'

export default class UserDto {
  @Length(1, 255)
  bio!: string
}
