import { Body, Query, Req, UploadedFiles } from '@nestjs/common/decorators/http/route-params.decorator'
import { DiscordBotService } from 'src/extension-modules/discord/discord-bot.service'
import { MessageService } from 'src/extension-modules/messages/messages.service'
import { ReportPath } from 'src/extension-modules/report/interfaces/ReportPath'
import { JwtOptionalAuthGuard } from 'src/modules/auth/jwt-optional-auth.guard'
import { RequestUserPayload, RoleLevel } from 'src/modules/auth/jwt.payload'
import { ReportService } from 'src/extension-modules/report/report.service'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { validateReCaptcha } from 'src/utils/validate-captcha'
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard'
import ApproveReprove from './interfaces/approve-reprove'
import CreateBotDto from './dtos/created-edited/bot.dto'
import UpdateBotDto from './dtos/update/update-bot.dto'
import { BotReport } from './dtos/report/bot-report'
import { User } from '../users/schemas/User.schema'
import UploadFiles from './interfaces/upload-files'
import { UserService } from '../users/user.service'
import Reason from './dtos/approve-reprove/reason'
import { SvgCreator } from 'src/utils/svg-creator'
import { VoteDto } from './dtos/vote/vote.dto'
import TimeError from './exceptions/TimeError'
import { NotBot } from './exceptions/not-bot'
import FindBot from './interfaces/find-bot'
import { Bot } from './schemas/Bot.schema'
import { BotService } from './bot.service'
import { Response } from 'express'
import _ from 'lodash'
import {
  UseInterceptors,
  HttpException,
  Controller,
  HttpStatus,
  UseGuards,
  Delete,
  Header,
  Param,
  Patch,
  Post,
  Get,
  Res,
  Put
} from '@nestjs/common'
import { RemoveBotDto } from './dtos/remove/remove-bot.dto'
import { captcha } from '../../../../config.json'

@Controller('bots')
export default class BotController {
  constructor (
    private readonly botService: BotService,
    private readonly userService: UserService,
    private readonly discordBotService: DiscordBotService,
    private readonly reportService: ReportService,
    private readonly messageService: MessageService
  ) {}

  @Get(':id')
  @UseGuards(JwtOptionalAuthGuard)
  async show (@Param('id') id: string, @Req() req: Express.Request): Promise<Bot> {
    const user = req.user as RequestUserPayload | boolean
    let bot

    if (user !== false) {
      bot = await this.botService.show(id, true, false, true)

      if (bot == null) {
        throw new HttpException('Bot was not found.', HttpStatus.NOT_FOUND)
      }

      if ((user as RequestUserPayload).role >= RoleLevel.adm ||
        bot.owner === (user as RequestUserPayload).userId ||
        ((bot.details.otherOwners as string[]).findIndex(x => x === (user as RequestUserPayload).userId) !== -1)
      ) {
        return bot
      } else {
        return new Bot(bot, true, false, false)
      }
    } else {
      bot = await this.botService.show(id, true, false)
    }

    if (bot == null) {
      throw new HttpException('Bot was not found.', HttpStatus.NOT_FOUND)
    }
    return bot
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove (@Param('id') id: string, @Req() req: Express.Request): Promise<{deleted: boolean}> {
    const { userId } = req.user as RequestUserPayload
    const bot = await this.botService.show(id, false)
    if (bot != null) {
      if (bot.owner === userId) {
        return {
          deleted: await this.botService.delete(id)
        }
      } else {
        throw new HttpException('You do not have sufficient permission to remove this bot.', HttpStatus.UNAUTHORIZED)
      }
    } else {
      throw new HttpException('Bot was not found.', HttpStatus.NOT_FOUND)
    }
  }

  @Post(':id/reason-remove')
  @UseGuards(JwtAuthGuard)
  async reasonRemove (@Param('id') id: string, @Body() body: RemoveBotDto, @Req() req: Express.Request): Promise<{deleted: boolean}> {
    const { role, userId } = req.user as RequestUserPayload
    const bot = await this.botService.show(id, false)
    if (bot != null) {
      if (role >= RoleLevel.adm) {
        const user = await this.userService.show(userId) as User
        this.messageService.sendRemove(bot, body.reason, user)

        return {
          deleted: await this.botService.delete(id)
        }
      } else {
        throw new HttpException('You do not have sufficient permission to remove this bot.', HttpStatus.UNAUTHORIZED)
      }
    } else {
      throw new HttpException('Bot was not found.', HttpStatus.NOT_FOUND)
    }
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateAllBots (@Query('type') type: string, @Req() req: Express.Request): Promise<void> {
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
  async showAll (@Query() query: FindBot): Promise<Bot[] | { bots_count: number } | undefined> {
    const queryPage = Number.parseInt(query.page)
    const queryLimit = Number.parseInt(query.limit)

    const page = Number.isNaN(queryPage) ? 1 : queryPage < 1 ? 1 : queryPage
    const limit = Number.isNaN(queryLimit) ? 18 : queryLimit < 1 ? 1 : (queryLimit > 18) ? 18 : queryLimit

    switch (query.type) {
      case 'count':
        return {
          bots_count: await this.botService.count()
        }
      case 'top':
        return (
          await this.botService
            .showAll('', 'mostVoted', page, limit)
        ).map(bot => new Bot(bot, false, false, false))
      case 'toapprove':
        return await this.botService.botsToApprove()
      case 'random': {
        const bots = await this.botService.showRandom(limit)

        return bots.map(bot => new Bot(bot, false, false, false))
      }
      default: {
        const tags = query.tags?.split(',')

        const bots = await this.botService.showAll(query.search ?? '', 'recent', page, limit, tags)

        if (_.isEmpty(bots)) {
          throw new HttpException('No bot found in the list.', HttpStatus.NOT_FOUND)
        }

        return (
          bots
        ).map(bot => new Bot(bot, false, false, false))
      }
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async add (@Body() bot: CreateBotDto, @Req() req: Express.Request): Promise<Bot> {
    let botResult
    try {
      botResult = await this.botService.add(bot, req.user as RequestUserPayload)
    } catch (error) {
      if (error instanceof NotBot) {
        throw new HttpException({
          bot: error.bot,
          id: error.id,
          idError: true
        }, HttpStatus.BAD_REQUEST)
      } else {
        console.log(error)
        throw new HttpException('Discord returned invalid data.', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
    if (botResult === null) {
      throw new HttpException('The bot already exists.', HttpStatus.CONFLICT)
    } else {
      return botResult
    }
  }

  @Post(':id/votes')
  @UseGuards(JwtAuthGuard)
  async vote (@Body() body: VoteDto, @Param('id') id: string, @Req() req: Express.Request): Promise<Bot> {
    if (captcha.enabled && !await validateReCaptcha(body['g-recaptcha-response'])) {
      throw new HttpException('ReCaptcha failed', HttpStatus.BAD_REQUEST)
    }

    try {
      const { userId } = req.user as RequestUserPayload
      const bot = await this.botService.vote(id, userId)
      if (bot != null) {
        return bot
      } else {
        throw new HttpException('Bot was not found.', HttpStatus.NOT_FOUND)
      }
    } catch (error) {
      if (error instanceof TimeError) {
        throw new HttpException({
          reason: 'You need to wait 8 hours to vote again.',
          nextVote: error.next.toISOString()
        }, HttpStatus.TOO_MANY_REQUESTS)
      } else {
        throw error
      }
    }
  }

  @Post(':id/reports')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'files', maxCount: 5 }
  ], {
    limits: {
      fileSize: 10485760
    }
  }))
  @UseGuards(JwtAuthGuard)
  async report (
    @Param('id') id: string,
      @Body() report: BotReport,
      @Req() req: Express.Request,
      @UploadedFiles() files: UploadFiles
  ): Promise<{ bot: Bot, reports: string[] }> {
    const { userId } = req.user as RequestUserPayload
    const bot = await this.botService.findById(id)

    if (bot === null) {
      throw new HttpException('Bot was not found.', HttpStatus.NOT_FOUND)
    }
    const user = await this.userService.findById(userId)
    let filesPath: ReportPath[] = []
    if (!_.isEmpty(files)) {
      try {
        filesPath = await this.reportService.writeReport(files.files, bot._id)
      } catch (error) {
        throw new HttpException('Fail to save files.', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }

    try {
      await this.discordBotService.sendReport(report, filesPath, bot, user)
    } catch (error) {
      throw new HttpException('Fail send message.', HttpStatus.INTERNAL_SERVER_ERROR)
    }

    return {
      bot: new Bot(bot, false, false, false),
      reports: filesPath.map(x => x.fileName)
    }
  }

  @Get(':id/reports/:fileName')
  @Header('Cache-Control', 'public, max-age=31536000, immutable, only-if-cached')
  async getReport (@Param('id') id: string, @Param('fileName') fileName: string, @Res() res: Response): Promise<void> {
    try {
      const image = await this.reportService.readReport(id, fileName)
      res.contentType(image.type)
      res.send(image.data)
    } catch (error) {
      throw new HttpException('Report not found.', HttpStatus.NOT_FOUND)
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update (@Param('id') id: string, @Body() bot: UpdateBotDto, @Req() req: Express.Request): Promise<Bot> {
    const { role, userId } = req.user as RequestUserPayload
    let botUpdate = await this.botService.show(id, false)

    if (botUpdate != null) {
      if (role >= RoleLevel.adm || botUpdate.owner === userId || ((botUpdate.details.otherOwners as string[]).findIndex(x => x === userId) !== -1)) {
        try {
          botUpdate = await this.botService.update(bot, botUpdate)
        } catch (error) {
          if (error instanceof NotBot) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST)
          } else {
            throw error
          }
        }

        if (botUpdate != null) {
          await this.discordBotService.updateBot(botUpdate, await this.userService.show(userId) as User)
          return botUpdate
        } else {
          throw new HttpException('Fail to update bot.', HttpStatus.INTERNAL_SERVER_ERROR)
        }
      } else {
        throw new HttpException('You do not have sufficient permission to update this bot.', HttpStatus.UNAUTHORIZED)
      }
    } else {
      throw new HttpException('Bot was not found.', HttpStatus.NOT_FOUND)
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async approveOrReprove (
    @Param('id') id: string,
      @Body() reason: Reason,
      @Req() req: Express.Request,
      @Query() query: ApproveReprove
  ): Promise<{ message: string }> {
    const { role, userId } = req.user as RequestUserPayload

    const user = await this.userService.findById(userId)
    const bot = await this.botService.show(id, false, false, false)

    if (role < RoleLevel.checker) {
      throw new HttpException('You do not have sufficient permission to update this bot.', HttpStatus.UNAUTHORIZED)
    }

    switch (query.type) {
      case 'approve': {
        try {
          const botResult = await this.botService.approve(bot as Bot, user)

          if (botResult === null || botResult === undefined) {
            throw new HttpException('Bot not found', HttpStatus.NOT_FOUND)
          }

          return {
            message: `The bot was approved by ${user.username}#${user.discriminator}`
          }
        } catch (error) {
          throw new HttpException(error.message, HttpStatus.AMBIGUOUS)
        }
      }

      case 'reject': {
        if (bot === undefined) {
          throw new HttpException('Bot not found', HttpStatus.NOT_FOUND)
        }

        await this.botService.reprove(bot, user, reason.reason)
        return {
          message: `The bot was rejected by ${user.username}#${user.discriminator}`
        }
      }

      default: {
        throw new HttpException('Type not found', HttpStatus.BAD_REQUEST)
      }
    }
  }

  @Get(':id/shield')
  @Header('Cache-Control', 'no-cache')
  async shield (@Param('id') id: string, @Res() res: Response, @Query('type') type: string): Promise<Response<unknown>> {
    const svgCreator = new SvgCreator()

    const bot = await this.botService.show(id, false, true)

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
