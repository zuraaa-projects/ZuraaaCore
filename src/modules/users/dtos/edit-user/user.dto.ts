import { MaxLength } from "class-validator"
import { Length } from 'class-validator'
class UserDto{
    @Length(1, 255)
    bio!: string
}
export default UserDto