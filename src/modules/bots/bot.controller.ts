import { Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards, Res, Delete, Header, Put, Patch } from '@nestjs/common'
import { Body, Query, Req } from '@nestjs/common/decorators/http/route-params.decorator'
import { BotService, TimeError } from 'src/modules/bots/bot.service'
import { SvgCreator } from 'src/utils/svg-creator'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Request, Response } from 'express'
import _ from 'lodash'
import { User } from '../users/schemas/User.schema'
import { RequestUserPayload, RoleLevel } from '../auth/jwt.payload'
import { Bot } from './schemas/Bot.schema'
import CreateBotDto from './dtos/created-edited/bot.dto'

@Controller('bots')
export default class BotController {
  constructor (private readonly botService: BotService) {}

  @Get(':id')
  async show (@Param('id') id: string): Promise<Bot> {
    const bot = await this.botService.show(id, true)
    if (bot === undefined || _.isEmpty(bot)) {
      throw new HttpException('Bot was not found.', HttpStatus.NOT_FOUND)
    }
    return bot
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove (@Param('id') id: string, @Req() req: Request): Promise<{deleted: boolean}> {
    const { role, userId } = req.user as RequestUserPayload
    const bot = await this.botService.show(id, false)
    if (role >= RoleLevel.adm || (bot !== undefined && bot.owner === userId)) {
      return {
        deleted: await this.botService.delete(id)
      }
    } else {
      throw new HttpException('You do not have sufficient permission to remove this bot.', HttpStatus.UNAUTHORIZED)
    }
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateAllBots (@Query('type') type: string, @Req() req: Request): Promise<void> {
    const { role } = req.user as RequestUserPayload
    if (role === RoleLevel.owner) {
      if (type === 'resetVotes') {
        return await this.botService.resetVotes()
      }
    } else {
      throw new HttpException('You do not have sufficient permission to use this endpoint.', HttpStatus.UNAUTHORIZED)
    }
  }

  @Get()
  async showAll (@Query() query: {[keyof: string]: string}): Promise<Bot[] | { bots_count: number } | undefined> {
    switch (query.type) {
      case 'count':
        return {
          bots_count: await this.botService.count()
        }
      case 'top':
        return (
          await this.botService
            .showAll('', 'mostVoted', 1, 6)
        ).map(bot => new Bot(bot, false))
      case 'page': {
        let page = Number(query.page)

        if (Number.isNaN(page) || page < 1) {
          page = 1
        }

        return (
          await this.botService.showAll(query.search ?? '', 'recent', page)
        ).map(bot => new Bot(bot, false))
      }
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async add (@Body() bot: CreateBotDto, @Req() req: Request): Promise<Bot> {
    return (await this.botService.add(bot, req.user as RequestUserPayload))
  }

  @Post(':id/votes')
  @UseGuards(JwtAuthGuard)
  async vote (@Param('id') id: string, @Req() req: Request): Promise<number | string | Date > {
    try {
      const { userId } = req.user as RequestUserPayload
      const result = await this.botService.vote(id, userId)
      if (result === undefined) {
        throw new HttpException('Bot was Not Found', HttpStatus.NOT_FOUND)
      }
      return result
    } catch (error) {
      if (error instanceof TimeError) {
        throw new HttpException(error.nextTime, HttpStatus.TOO_MANY_REQUESTS)
      }
      throw new HttpException('404', HttpStatus.NOT_FOUND)
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateBot (@Param('id') id: string, @Body() updatedBot: CreateBotDto, @Req() req: Request): Promise<Bot> {
    const { role, userId } = req.user as RequestUserPayload
    const oldBot = await this.botService.show(id)
    if (oldBot === undefined || _.isEmpty(oldBot)) {
      throw new HttpException('Bot was not found.', HttpStatus.NOT_FOUND)
    }
    if (role >= RoleLevel.adm || (oldBot !== undefined && oldBot.owner === userId)) {
      return (await this.botService.update(oldBot._id, updatedBot))
    } else {
      throw new HttpException('You do not have sufficient permission to use this endpoint because this bot is not yours.', HttpStatus.UNAUTHORIZED)
    }
  }

  @Get(':id/shield')
  @Header('Cache-Control', 'no-cache')
  async shield (@Param('id') id: string, @Res() res: Response, @Query('type') type: string): Promise<Response<unknown>> {
    const svgCreator = new SvgCreator()

    const bot = await this.botService.show(id, false, false)

    if (bot === undefined) {
      throw new HttpException('Bot was not found.', HttpStatus.NOT_FOUND)
    }

    let svg = ''
    const { username, discriminator, _id } = bot.owner as User
    switch (type) {
      case 'tinyOwnerBot':
        svg = svgCreator.tinyOwnerShield(username + '#' + discriminator, _id)
        break
      default:
        svg = svgCreator.tinyUpvoteShield(bot.votes.current, bot._id)
        break
    }

    return res.set('content-type', 'image/svg+xml').send(svg)
  }
}
