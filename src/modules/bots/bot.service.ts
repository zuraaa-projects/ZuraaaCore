import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, FilterQuery } from 'mongoose'
import { DiscordBotService } from 'src/extension-modules/discord/discord-bot.service'
import { updateDiscordData } from 'src/utils/discord-update-data'
import { RequestUserPayload } from '../auth/jwt.payload'
import { User } from '../users/schemas/User.schema'
import CreateBotDto from './dtos/created-edited/bot.dto'
import { Bot, BotDocument } from './schemas/Bot.schema'
import { AvatarService } from '../avatars/avatar.service'
import md from 'markdown-it'
import xss from 'xss'
import { fetchServerCount } from '../../utils/httpExtensions'
import { UserService } from '../users/user.service'

@Injectable()
export class BotService {
  constructor (
    @InjectModel(Bot.name) private readonly BotModel: Model<BotDocument>,
    private readonly discordService: DiscordBotService,
    private readonly avatarService: AvatarService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ) {}

  private async updateAndGetServerCount (bot: BotDocument | null, id?: string, getCount = false): Promise<unknown | number> {
    if (bot !== null) {
      bot.details.guilds = await fetchServerCount(bot._id)
      await bot.save()
      if (getCount) {
        return bot.details.guilds
      }
    } else if (id !== undefined) {
      const count = await fetchServerCount(id)
      const result = await this.BotModel.findOne({
        $or: [
          {
            _id: id
          },
          {
            'details.customURL': id
          }
        ]
      }).exec()

      if (result !== null) {
        result.details.guilds = count
        await result.save()
        if (getCount) {
          return result.details.guilds
        }
      }
    }
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
      await this.updateAndGetServerCount(bot)
      botsFormated.push(new Bot(bot, false))
    }

    return botsFormated
  }

  async count (): Promise<number> {
    return await this.BotModel.countDocuments()
  }

  async show (id: string, voteLog = false, ownerData = false): Promise<Bot | undefined> {
    await this.updateAndGetServerCount(null, id)
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
      query = query.populate('owner')
    }
    const result = await query.exec()

    if (result === null) {
      return
    }
    return new Bot(await updateDiscordData(result, this.discordService, this.avatarService), voteLog)
  }

  async showAll (search: string, sort = 'recent', page = 1, limit = 18): Promise<Bot[]> {
    const params: FilterQuery<unknown> = {
      $and: [{ approvedBy: { $ne: null } }]
    }
    let sortType: Record<string, unknown> = {}
    if (search.length > 0) {
      const regex = { $regex: search, $options: 'i' }
      params.$or = [{ username: regex }, { 'details.shortDescription': regex }]
    }

    if (sort === 'recent') {
      sortType = { 'dates.sent': -1 }
    } else if (sort === 'mostVoted') {
      sortType = { 'votes.current': -1 }
    }

    const bots = await this.BotModel
      .find(params)
      .sort(sortType)
      .limit(limit)
      .skip((page - 1) * limit)
      // .setOptions({
      //   // allowDiskUse: true
      // })
      .exec()
    const botsFormated: Bot[] = []

    for (const bot of bots) {
      await this.updateAndGetServerCount(bot)
      botsFormated.push(new Bot(bot, false))
    }
    return botsFormated
  }

  async add (bot: CreateBotDto, userPayload: RequestUserPayload): Promise<Bot> {
    const botElement = new this.BotModel(bot)
    botElement.owner = userPayload.userId
    const { isHTML, longDescription } = bot.details
    botElement.details.htmlDescription = (isHTML) ? xss(longDescription) : md().render(longDescription)
    const botTrated = await updateDiscordData(botElement, this.discordService, this.avatarService)
    if (botTrated === undefined) {
      throw new Error('Discord Retornou dados invalidos.')
    }
    await botTrated.save()
    await this.updateAndGetServerCount(botTrated)
    return new Bot(botElement, false)
  }

  async delete (id: string): Promise<boolean> {
    const deleted = await this.BotModel.deleteOne({
      _id: id
    }).exec()

    if (deleted.n === undefined || isNaN(deleted.n)) {
      return false
    }
    return true
  }

  async update (id: string, newBot: CreateBotDto): Promise<Bot> {
    const updatedBot = new this.BotModel(newBot)
    const botTrated = await updateDiscordData(updatedBot, this.discordService, this.avatarService)
    if (botTrated === undefined) {
      throw new Error('Discord Retornou dados invalidos.')
    }
    await this.BotModel.findByIdAndUpdate(id, botTrated)
    await this.updateAndGetServerCount(botTrated)
    return new Bot(updatedBot, false)
  }

  async vote (idBot: string, idUser: string): Promise<number | undefined | string> {
    const botDb = await this.BotModel.findById(idBot).exec()
    if (botDb === null) {
      return undefined
    }

    const discordBotDb = await updateDiscordData(botDb, this.discordService, this.avatarService)
    if (discordBotDb === undefined) {
      return undefined
    }
    const user = await this.userService.findById(idUser)
    const now = new Date()
    const next = user.dates.nextVote
    if (next !== undefined && next > now) {
      throw new TimeError('Ainda falta tempo pra votar', next)
    }
    now.setHours(now.getHours() + 8)

    const semiUser = {
      bio: user.details.description,
      nextVote: now
    }

    await this.userService.update(semiUser, idUser, { type: 'voteTimestamp' })

    discordBotDb.votes.current += 1
    discordBotDb.votes.voteslog.push(user._id)
    await discordBotDb.save()

    return discordBotDb.votes.current
  }

  async resetVotes (): Promise<void> {
    return await this.BotModel.updateMany({}, {
      'votes.current': 0,
      'votes.voteslog': []
    }).exec()
  }
}

export class TimeError extends Error {
  public nextTime: Date

  constructor (message: string, time: Date) {
    super(message)
    this.nextTime = time
  }
}
