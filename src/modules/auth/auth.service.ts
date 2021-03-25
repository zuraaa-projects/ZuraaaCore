import { DiscordBotService } from 'src/extension-modules/discord/discord-bot.service'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UserService } from '../users-bots/users/user.service'
import { User } from '../users-bots/users/schemas/User.schema'
import { Jwt, JwtDocument } from './schema/jwt.schema'
import { InjectModel } from '@nestjs/mongoose'
import { JwtPayload } from './jwt.payload'
import { JwtService } from '@nestjs/jwt'
import { Model } from 'mongoose'
import { JwtToken } from './schema/jwt-token.schema'

@Injectable()
export class AuthService {
  constructor (
    @InjectModel(Jwt.name) private readonly JwtModel: Model<JwtDocument>,
    private readonly discordService: DiscordBotService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

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

    const token = new JwtToken()
    token.token = this.jwtService.sign(payload)

    const jwt = new this.JwtModel()
    jwt._id = user._id
    jwt.tokens.push(token)

    await jwt.save()

    return {
      access_token: token.token,
      role: (user.details.role !== undefined) ? user.details.role : 0
    }
  }
}
