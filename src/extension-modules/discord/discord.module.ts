import { Module } from '@nestjs/common'
import { DiscordBotService } from 'src/extension-modules/discord/discord-bot.service'

@Module({
  providers: [DiscordBotService],
  exports: [DiscordBotService]
})
export class DiscordModule {}
