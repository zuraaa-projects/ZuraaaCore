import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'

import { DiscordModule } from 'src/extension-modules/discord/discord.module'

import { AvatarModule } from './avatars/avatar.module'

import { User, UserSchema } from './users/schemas/User.schema'
import UserController from './users/user.controller'
import { UserService } from './users/user.service'

import { Bot, BotSchema } from './bots/schemas/Bot.schema'
import { BotService } from './bots/bot.service'
import BotController from './bots/bot.controller'

@Module({
  imports: [
    DiscordModule,
    AvatarModule,

    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      }
    ]),
    MongooseModule.forFeature([
      {
        name: Bot.name,
        schema: BotSchema
      }
    ])
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
export class Bots_UsersModule {}
