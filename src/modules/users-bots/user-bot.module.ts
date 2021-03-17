import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { DiscordModule } from 'src/extension-modules/discord/discord.module'
import { MessageModule } from 'src/extension-modules/messages/messages.module'
import { ReportModule } from 'src/extension-modules/report/report.module'
import { AvatarModule } from '../avatars/avatar.module'
import BotController from './bots/bot.controller'
import { BotService } from './bots/bot.service'
import { Bot, BotSchema } from './bots/schemas/Bot.schema'
import { User, UserSchema } from './users/schemas/User.schema'
import UserController from './users/user.controller'
import { UserService } from './users/user.service'

@Module({
  imports: [
    DiscordModule,
    MongooseModule.forFeature([
      {
        name: Bot.name,
        schema: BotSchema
      },
      {
        name: User.name,
        schema: UserSchema
      }
    ]),
    AvatarModule,
    ReportModule,
    MessageModule
  ],
  providers: [
    BotService,
    UserService
  ],
  controllers: [
    BotController,
    UserController
  ],
  exports: [
    BotService,
    UserService
  ]
})
export class UserBotModule {}
