import { Module } from '@nestjs/common'
import { ThrottlerModule } from '@nestjs/throttler'

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 30,
      limit: 3
    })
  ]
})
export class RateLimitiModule {}
