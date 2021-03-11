import { Body, Controller, Get, HttpException, HttpStatus, Param, Put, Req, UseGuards } from '@nestjs/common'
import _ from 'lodash'
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard'
import { RequestUserPayload, RoleLevel } from 'src/modules/auth/jwt.payload'
import { BotService } from '../bots/bot.service'
import { Bot } from '../bots/schemas/Bot.schema'
import UpdateUserDto from './dtos/update-user/update-user.dto'
import UserDto from './dtos/edit-user/user.dto'
import { User } from './schemas/User.schema'
import { UserService } from './user.service'

@Controller('users')
export default class UserController {
  constructor (private readonly userService: UserService, private readonly botService: BotService) {}

  @Get('@me')
  @UseGuards(JwtAuthGuard)
  async showMe (@Req() req: Express.Request): Promise<User> {
    const { userId } = req.user as RequestUserPayload

    const returnData = await this.userService.show(userId)

    if (returnData === undefined || _.isEmpty(returnData)) {
      throw new HttpException('Could not validate the User or Discord Service is unstable', HttpStatus.INTERNAL_SERVER_ERROR)
    }

    return new User(returnData, false, false)
  }

  @Get(':id')
  async show (@Param('id') id: string): Promise<User> {
    const user = await this.userService.show(id)

    if (user === undefined || _.isEmpty(user)) {
      throw new HttpException('User was not found.', HttpStatus.NOT_FOUND)
    }

    return new User(user, false, false)
  }

  @Get(':id/bots')
  async getBots (@Param('id') id: string): Promise<Bot[]> {
    const user = await this.userService.show(id)

    if (user === undefined || _.isEmpty(user)) {
      throw new HttpException('User was not found.', HttpStatus.NOT_FOUND)
    }

    const bots = await this.botService.getBotsByOwner(user)

    const botsFormated: Bot[] = []

    for (const bot of bots) {
      botsFormated.push(new Bot(bot, false, false, false))
    }

    return botsFormated
  }

  @Put('@me')
  @UseGuards(JwtAuthGuard)
  async updateMe (@Body() userData: UserDto, @Req() req: Express.Request): Promise<User> {
    const { userId } = req.user as RequestUserPayload

    const updatedData = await this.userService.updateMe(userData, userId)
    if (updatedData === undefined || _.isEmpty(updatedData)) {
      throw new HttpException('Could not validate the User or Discord Service is unstable.', HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return new User(updatedData, false, false)
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update (@Param('id') id: string, @Body() updateUser: UpdateUserDto, @Req() req: Express.Request): Promise<User> {
    const { role, userId } = req.user as RequestUserPayload
    const user = await this.userService.findById(id)

    if (role <= RoleLevel.checker) {
      throw new HttpException('You do not have sufficient permission', HttpStatus.UNAUTHORIZED)
    }

    if (user.banned !== updateUser.banned && role <= user.details.role) {
      throw new HttpException('You do not have sufficient permission', HttpStatus.UNAUTHORIZED)
    }

    if (updateUser.details.role !== user.details.role && updateUser.details.role >= role) {
      throw new HttpException('You do not have sufficient permission', HttpStatus.UNAUTHORIZED)
    }

    await this.userService.update(user, updateUser, await this.userService.findById(userId))

    if (user.banned) {
      const bots = await this.botService.getBotsByOwner(user)

      for (let i = 0; i < bots.length; i++) {
        const bot = bots[i]
        await this.botService.delete(bot._id)
      }
    }

    return new User(user, true, true)
  }
}
