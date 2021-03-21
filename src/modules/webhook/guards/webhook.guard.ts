import { ExecutionContext, Inject, Injectable } from '@nestjs/common'
import { ThrottlerException, ThrottlerGuard, ThrottlerStorageService } from '@nestjs/throttler'

@Injectable()
export class WebhookGuard extends ThrottlerGuard {
  @Inject()
  storage!: ThrottlerStorageService

  async handleRequest (context: ExecutionContext, limit: number, ttl: number): Promise<boolean> {
    const req = context.switchToHttp().getRequest()
    const key = this.generateKey(context, req.headers.authorization as string)
    const ttls = await this.storage.getRecord(key)

    if (ttls.length >= limit) {
      throw new ThrottlerException()
    }

    await this.storage.addRecord(key, ttl)
    return true
  }
}
