import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { jwt } from '../../../config.json'
import { User } from '../users-bots/users/schemas/User.schema'

@Controller('auth')
export default class AuthController {
  constructor (private readonly authService: AuthService) {}

  @Post('user')
  async login (@Body() data: {
    type: string
    identify: string
    data: string
  }): Promise<{ access_token: string }> {
    if (!jwt.authorized_clients.some(x => x.secret === data.identify && x.type === data.type)) {
      throw new HttpException('The application is not authorized to use this endpoint.', HttpStatus.UNAUTHORIZED)
    }

    let userLogged: User

    if (data.type === 'bot') {
      userLogged = await this.authService.getUser(data.data)
    } else if (data.type === 'code') {
      userLogged = await this.authService.validateUser(data.data).catch(() => {
        throw new HttpException('\'data\' is invalid.', HttpStatus.BAD_REQUEST)
      })
    } else {
      throw new HttpException(`Type ${data.type} not implemented`, HttpStatus.NOT_IMPLEMENTED)
    }

    return this.authService.login(userLogged)
  }
}
