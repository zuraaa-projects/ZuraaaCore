import { Body, Controller, Get, HttpException, HttpStatus, Param, Put, Query, Req, UseGuards } from '@nestjs/common'
import { BotService } from 'src/modules/bots/bot.service'
import { UserService } from 'src/modules/users/user.service'
import _ from 'lodash'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import UserDto from './dtos/edit-user/user.dto'
import { RequestUserPayload } from '../auth/jwt.payload'
import { User } from './schemas/User.schema'
import { Bot } from '../bots/schemas/Bot.schema'

@Controller('users')
export default class UserController {
  constructor (private readonly userService: UserService, private readonly botService: BotService) {}

  @Get('@me')
  @UseGuards(JwtAuthGuard)
  async showMe (@Req() req: Express.Request, @Query('avatarBuffer') avatarBuffer: boolean): Promise<User> {
    const { userId } = req.user as RequestUserPayload

    const returnData = await this.userService.show(userId, avatarBuffer)

    if (returnData === undefined || _.isEmpty(returnData)) { throw new HttpException('Could not validate the User or Discord Service is unstable', HttpStatus.INTERNAL_SERVER_ERROR) }

    return returnData
  }

  @Get(':id')
  async show (@Param('id') id: string, @Query('avatarBuffer') avatarBuffer: boolean): Promise<User> {
    const user = await this.userService.show(id, avatarBuffer)

    if (user === undefined || _.isEmpty(user)) { throw new HttpException('User was not found.', HttpStatus.NOT_FOUND) }

    return user
  }

  @Get(':id/bots')
  async getBots (@Param('id') id: string): Promise<Bot[]> {
    const user = await this.userService.show(id, false)

    if (user === undefined || _.isEmpty(user)) { throw new HttpException('User was not found.', HttpStatus.NOT_FOUND) }

    return await this.botService.getBotsByOwner(user)
  }

  @Put('@me')
  @UseGuards(JwtAuthGuard)
  async update (@Body() userData: UserDto, @Req() req: Express.Request): Promise<User> {
    const { userId } = req.user as RequestUserPayload

    const updatedData = await this.userService.update(userData, userId)
    if (updatedData === undefined || _.isEmpty(updatedData)) { throw new HttpException('Could not validate the User or Discord Service is unstable.', HttpStatus.INTERNAL_SERVER_ERROR) }
    return updatedData
  }
}
