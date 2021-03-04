import { Module } from '@nestjs/common'
import { DiscordModule } from 'src/extension-modules/discord/discord.module'
import AvatarController from './avatar.controller'
import { AvatarService } from './avatar.service'

@Module({
  controllers: [
    AvatarController
  ],
  providers: [
    AvatarService
  ],
  exports: [
    AvatarService
  ],
  imports: [
    DiscordModule
  ]
})
export class AvatarModule {}
