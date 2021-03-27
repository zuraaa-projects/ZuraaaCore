import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { JwtPayload, RequestUserPayload } from './jwt.payload'
import { jwt } from '../../../config.json'
import { UserService } from '../users-bots/users/user.service'
import e from 'express'
import { AuthService } from './auth.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor (
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwt.secret
    })
  }

  async validate (payload: JwtPayload): Promise<RequestUserPayload> {
    const user = await this.userService.findById(payload.sub)

    if (user == null) {
      throw new HttpException('Token data is invalid.', HttpStatus.BAD_REQUEST)
    }

    if (user.banned) {
      throw new HttpException('You have been banned', HttpStatus.FORBIDDEN)
    }

    const validated: RequestUserPayload = {
      userId: payload.sub,
      role: payload.role
    }
    return validated
  }

  authenticate (req: e.Request): void {
    if (req.headers.authorization != null) {
      const token = req.headers.authorization.split(' ')[1]

      this.authService.findToken(token).then(result => {
        if (result) {
          super.authenticate(req)
        } else {
          this.error(new HttpException('Token invalid', HttpStatus.UNAUTHORIZED))
        }
      }).catch(error => {
        console.error(error)
      })
    } else {
      super.authenticate(req)
    }
  }
}
