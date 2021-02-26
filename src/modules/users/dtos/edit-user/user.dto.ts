import { IsOptional, Length } from 'class-validator'

class UserDto {
  @Length(1, 255)
  bio!: string

  @IsOptional()
  nextVote?: Date
}
export default UserDto
