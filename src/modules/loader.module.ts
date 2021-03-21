import { Module } from '@nestjs/common'
import { UserBotModule } from './users-bots/user-bot.module'
import { WebhookModule } from './webhook/webhook.module'

@Module({
  imports: [
    UserBotModule,
    WebhookModule
  ]
})
export class LoaderModule {}
