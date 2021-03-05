import { Module } from '@nestjs/common'
import { UserBotModule } from './users-bots/user-bot.module'

@Module({
  imports: [
    UserBotModule
  ]
})
export class LoaderModule {}
