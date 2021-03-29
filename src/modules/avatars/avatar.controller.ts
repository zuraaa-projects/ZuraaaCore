import { Controller, Get, Header, HttpException, HttpStatus, Param, Res } from '@nestjs/common'
import { Response } from 'express'
import _ from 'lodash'
import { DiscordBotService } from 'src/extension-modules/discord/discord-bot.service'
import { AvatarService } from './avatar.service'

@Controller('avatars')
export default class AvatarController {
  constructor (
    private readonly avatarsService: AvatarService,
    private readonly discordService: DiscordBotService
  ) {}

  @Get(':id/:avatar')
  @Header('Cache-Control', 'public, max-age=31536000, immutable, only-if-cached')
  async avatar (@Param('id') id: string, @Param('avatar') avatar: string, @Res() res: Response): Promise<void> {
    try {
      const image = await this.avatarsService.getAvatar(id, avatar)
      if (image != null) {
        res.contentType(image.type)
        res.send(image.data)
      } else {
        const user = await this.discordService.getUser(id)
        res.redirect(`https://cdn.discordapp.com/embed/avatars/${_.toInteger(user.discriminator) % 5}.png`)
      }
    } catch (error) {
      console.error(`Avatar not found (${id}) {${avatar}}`)
      throw new HttpException('Avatar not found', HttpStatus.NOT_FOUND)
    }
  }
}
