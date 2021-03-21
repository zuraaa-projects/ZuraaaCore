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

  @Get(':id')
  @Header('Cache-Control', 'public, max-age=60, only-if-cached')
  async avatar (@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      const image = await this.avatarsService.getAvatar(id)
      if (image != null) {
        res.contentType(image.type)
        res.send(image.data)
      } else {
        const user = await this.discordService.getUser(id)
        res.redirect(`https://cdn.discordapp.com/embed/avatars/${_.toInteger(user.discriminator) % 5}.png`)
      }
    } catch (error) {
      console.error('Not found')
      throw new HttpException('Avatar not found', HttpStatus.NOT_FOUND)
    }
  }
}
