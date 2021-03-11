import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { DiscordBotService } from 'src/extension-modules/discord/discord-bot.service'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './jwt.payload'
import { UserService } from '../users-bots/users/user.service'
import { User } from '../users-bots/users/schemas/User.schema'

@Injectable()
export class AuthService {
  constructor (private readonly discordService: DiscordBotService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService) {}

  async validateUser (code: string): Promise<User> {
    const discordUser = await this.discordService.getUserLogin(code)

    const userDb = await this.userService.login(discordUser)

    return userDb
  }

  async getUser (id: string): Promise<User> {
    const userDb = await this.userService.show(id)

    if (userDb === undefined) {
      throw new HttpException('User undefined', HttpStatus.BAD_REQUEST)
    }

    return userDb
  }

  async login (user: User): Promise<{ access_token: string, role: number }> {
    const payload: JwtPayload = {
      role: (user.details.role !== undefined) ? user.details.role : 0,
      sub: user._id
    }

    return {
      access_token: this.jwtService.sign(payload),
      role: (user.details.role !== undefined) ? user.details.role : 0
    }
  }
}
