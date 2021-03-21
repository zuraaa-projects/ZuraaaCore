import { DiscordBotService } from 'src/extension-modules/discord/discord-bot.service'
import { MessageService } from 'src/extension-modules/messages/messages.service'
import { AvatarService } from 'src/modules/avatars/avatar.service'
import { RequestUserPayload } from 'src/modules/auth/jwt.payload'
import { updateDiscordData } from 'src/utils/discord-update-data'
import CreateBotDto from './dtos/created-edited/bot.dto'
import { Bot, BotDocument } from './schemas/Bot.schema'
import UpdateBotDto from './dtos/update/update-bot.dto'
import { User } from '../users/schemas/User.schema'
import { UserService } from '../users/user.service'
import { discord } from '../../../../config.json'
import TimeError from './exceptions/TimeError'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { NotBot } from './exceptions/not-bot'
import { Injectable } from '@nestjs/common'
import sanitizeHtml from 'sanitize-html'
import md from 'markdown-it'
import axios from 'axios'
import _ from 'lodash'

@Injectable()
export class BotService {
  constructor (
    @InjectModel(Bot.name) private readonly BotModel: Model<BotDocument>,
    private readonly discordService: DiscordBotService,
    private readonly avatarService: AvatarService,
    private readonly userService: UserService,
    private readonly messageService: MessageService
  ) {}

  async findById (id: string): Promise<BotDocument | null> {
    return await this.BotModel.findById(id).exec()
  }

  async getBotsByOwner (owner: User): Promise<Bot[]> {
    const bots = await this.BotModel.find({
      $or: [
        {
          owner: owner._id
        },
        {
          'details.otherOwners': owner._id
        }
      ]
    }).exec()
    const botsFormated: Bot[] = []

    for (const bot of bots) {
      botsFormated.push(new Bot(bot, false, false, false))
    }

    return botsFormated
  }

  async count (): Promise<number> {
    return await this.BotModel.countDocuments()
  }

  async show (id: string, voteLog = false, ownerData = false, showWebhook = false): Promise<Bot | undefined> {
    let query = this.BotModel.findOne({
      $or: [
        {
          _id: id
        },
        {
          'details.customURL': id
        }
      ]
    })
    if (ownerData) {
      query = query
        .populate('owner')
        .populate('details.otherOwners')
    }
    const result = await query.exec()

    if (result === null) {
      return
    }

    if (discord.getServers.enabled) {
      try {
        const { data: { guilds } } = await axios.get(`${discord.getServers.url}/api/bots/${id}`)
        result.details.guilds = guilds
      } catch (error) {
        console.error(`Fail get guilds from ${id}`)
      }
    }

    return new Bot(await updateDiscordData(result, this.discordService, this.avatarService), voteLog, showWebhook, ownerData)
  }

  async showAll (pesquisa: string, sort = 'recent', pagina = 1, limite = 18, tags: string[] | undefined = undefined): Promise<Bot[]> {
    const params: FilterQuery<unknown> = {
      $and: [{ approvedBy: { $ne: null } }]
    }
    let ordenar: Record<string, unknown> = {}
    if (pesquisa.length > 0) {
      const regex = { $regex: pesquisa, $options: 'i' }
      params.$or = [{ username: regex }, { 'details.shortDescription': regex }]
    }

    if (sort === 'recent') {
      ordenar = { 'dates.sent': -1 }
    } else if (sort === 'mostVoted') {
      ordenar = { 'votes.current': -1 }
    }

    if (!_.isEmpty(tags)) {
      params.$and = [{
        'details.tags': {
          $all: tags
        }
      }]
    }

    const bots = await this.BotModel
      .find(params)
      .sort(ordenar)
      .limit(limite)
      .skip((pagina - 1) * limite)
      .setOptions({
        // allowDiskUse: true
      })
      .exec()
    const botsFormated: Bot[] = []

    for (const bot of bots) {
      botsFormated.push(new Bot(bot, false, false, false))
    }
    return botsFormated
  }

  async add (bot: CreateBotDto, userPayload: RequestUserPayload): Promise<Bot | null> {
    let discordUser = await this.messageService.getUser(bot._id)

    if (!discordUser.bot) {
      throw new NotBot(false, discordUser.id)
    }

    if (bot.details.otherOwners !== undefined) {
      for (let i = 0; i < bot.details.otherOwners.length; i++) {
        discordUser = await this.messageService.getUser(bot.details.otherOwners[i])
        if (discordUser.bot) {
          throw new NotBot(true, discordUser.id)
        }

        await this.userService.register(discordUser.id)
      }
    }

    let botElement = await this.BotModel.findById(bot._id).exec()
    if (botElement !== null) {
      return null
    }
    botElement = new this.BotModel(bot)
    botElement.owner = userPayload.userId
    const { isHTML, longDescription } = bot.details
    if (!_.isEmpty(longDescription)) {
      botElement.details.htmlDescription = (isHTML)
        ? this.sanitize(longDescription)
        : md().render(longDescription)
    }

    const botTrated = await updateDiscordData(botElement, this.discordService, this.avatarService, true)
    if (botTrated === undefined) {
      throw new Error('Discord Retornou dados invalidos.')
    }

    const user = await this.userService.findById(botTrated.owner as string)

    await this.discordService.addBot(botTrated, user)

    return new Bot(botElement, false, false, false)
  }

  async vote (id: string, userId: string): Promise<Bot | null> {
    const user = await this.userService.findById(userId)
    const next = user.dates.nextVote
    const now = new Date()
    if ((next != null) && next > now) {
      throw new TimeError(next)
    }

    const bot = await this.BotModel.findById(id).exec()
    if (bot === null) {
      return null
    }

    bot.votes.current += 1
    bot.votes.voteslog.push(userId)

    await this.userService.updateNextVote(now, userId)

    try {
      await this.discordService.sendVote(user, bot)
    } catch {

    }

    return new Bot(await bot.save(), true, false, false)
  }

  async delete (id: string): Promise<boolean> {
    const deleted = await this.BotModel.deleteOne({
      _id: id
    }).exec()

    if (deleted.n === undefined) {
      return false
    }
    return true
  }

  async resetVotes (): Promise<void> {
    await this.BotModel.updateMany({}, {
      'votes.current': 0,
      'votes.voteslog': []
    }).exec()
  }

  async update (bot: UpdateBotDto, botUpdate: Bot): Promise<Bot | undefined> {
    const botDb = await this.BotModel.findById(botUpdate._id).exec()
    if (botDb == null) {
      return
    }

    if (bot.details.otherOwners != null) {
      for (let i = 0; i < bot.details.otherOwners.length; i++) {
        const discordUser = await this.discordService.getUser(bot.details.otherOwners[i])
        if (discordUser.bot) {
          throw new NotBot(true, discordUser.id)
        }
      }
    }

    const discordBotDb = await updateDiscordData(botDb, this.discordService, this.avatarService)
    if (discordBotDb == null) {
      return
    }

    botDb.details.shortDescription = bot.details.shortDescription
    botDb.details.longDescription = bot.details.longDescription
    if (!_.isEmpty(bot.details.longDescription)) {
      botDb.details.htmlDescription = (bot.details.isHTML)
        ? this.sanitize(bot.details.longDescription)
        : md().render(bot.details.longDescription)
    } else {
      botDb.details.htmlDescription = ''
    }
    botDb.details.isHTML = bot.details.isHTML
    botDb.details.prefix = bot.details.prefix
    botDb.details.tags = bot.details.tags
    botDb.details.library = bot.details.library
    botDb.details.customInviteLink = bot.details.customInviteLink
    botDb.details.supportServer = bot.details.supportServer
    botDb.details.website = bot.details.website
    botDb.details.otherOwners = bot.details.otherOwners

    return new Bot(await botDb.save(), false, false, false)
  }

  private sanitize (html: string): string {
    return sanitizeHtml(html, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat([
        'iframe',
        'style',
        'img'
      ]),
      allowedAttributes: {
        iframe: [
          'sandbox',
          'title',
          'border'
        ],
        '*': [
          'style',
          'src',
          'href',
          'class',
          'id',
          'width',
          'heigth'
        ]
      },
      transformTags: {
        iframe: sanitizeHtml.simpleTransform('iframe', {
          sandbox: ''
        })
      },
      allowVulnerableTags: true
    })
  }

  async botsToApprove (): Promise<Bot[]> {
    const bots = await this.BotModel.find({
      approvedBy: null
    }).exec()

    return bots.map(x => new Bot(x, false, false, false))
  }

  async approve (bot: Bot, user: User): Promise<Bot | null | undefined> {
    const botResult = await this.BotModel.findById(bot._id).exec()

    if (botResult == null) {
      return null
    }

    if (botResult.approvedBy !== null) {
      throw new Error('Bot has already been approved')
    }

    botResult.approvedBy = user._id

    await this.discordService.approveBot(botResult, user)

    await botResult.save()

    return await updateDiscordData(botResult, this.discordService, this.avatarService)
  }

  async reprove (bot: Bot, user: User, reason: string): Promise<void> {
    await this.delete(bot._id)
    await this.discordService.reproveBot(bot, user, reason)
  }
}
