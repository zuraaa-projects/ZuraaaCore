import { Controller, Get, Param, Res } from '@nestjs/common'
import { Response } from 'express'
import { AvatarService } from './avatar.service'

@Controller('avatars')
export default class AvatarController {
  constructor (private readonly avatarsService: AvatarService) {}

  @Get(':id')
  async avatar (@Param('id') id: string, @Res() res: Response): Promise<void> {
    const image = await this.avatarsService.getAvatar(id)
    if (image !== undefined) {
      res.contentType(image.type)
      res.send(image.data)
    } else {
      res.redirect('https://cdn.discordapp.com/embed/avatars/4.png')
    }
  }
}
