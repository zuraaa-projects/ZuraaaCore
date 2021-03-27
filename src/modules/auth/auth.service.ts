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

    if (userDb == null) {
      throw new HttpException('User undefined', HttpStatus.BAD_REQUEST)
    }

    return userDb
  }

  async login (user: User): Promise<{ access_token: string, role: number }> {
    const payload: JwtPayload = {
      role: (user.details.role != null) ? user.details.role : 0,
      sub: user._id
    }

    const token = this.jwtService.sign(payload)

    await this.saveToken(user._id, token)

    return {
      access_token: token,
      role: (user.details.role != null) ? user.details.role : 0
    }
  }

  private async saveToken (userId: string, token: string): Promise<void> {
    const jwt = await this.JwtModel.findById(userId)

    if (jwt != null) {
      const jwtToken = new JwtToken()
      jwtToken.token = token

      jwt.tokens.push(jwtToken)

      await jwt.save()
    } else {
      const jwtToken = new JwtToken()
      jwtToken.token = token

      const jwt = new this.JwtModel()
      jwt._id = userId

      jwt.tokens.push(jwtToken)
      await jwt.save()
    }
  }

  async findToken (token: string): Promise<boolean> {
    const jwt = await this.JwtModel.findOne({
      tokens: {
        $elemMatch: {
          token: token
        }
      }
    }).exec()

    if (jwt == null) {
      return false
    }

    let contains = false

    for (let i = 0; i < jwt.tokens.length; i++) {
      const tokenJwt = jwt.tokens[i]
      tokenJwt.created.setDate(tokenJwt.created.getDate() + 15)
      if (tokenJwt.created <= new Date()) {
        jwt.tokens.splice(i, 1)
      }

      if (!contains) {
        if (tokenJwt.token === token) {
          contains = true
        }
      }
    }

    await jwt.save()

    return contains
  }
}
