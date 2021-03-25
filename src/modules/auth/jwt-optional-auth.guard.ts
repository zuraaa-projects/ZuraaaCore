import { Injectable } from '@nestjs/common'
import { JwtAuthGuard } from './jwt-auth.guard'

@Injectable()
export class JwtOptionalAuthGuard extends JwtAuthGuard {
  handleRequest<RequestUserPayload> (err: never, user: never, info: never, context: never, status?: never): RequestUserPayload {
    if (err) {
      console.error(err)
    }

    return user
  }
}
