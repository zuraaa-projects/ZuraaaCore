import { Injectable } from '@nestjs/common'
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
import _ from 'lodash'

@Injectable()
export class BotService {
  constructor (
    @InjectModel(Bot.name) private readonly BotModel: Model<BotDocument>,
    private readonly discordService: DiscordBotService,
    private readonly avatarService: AvatarService
  ) {}

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
      botsFormated.push(new Bot(bot, false))
    }

    return botsFormated
  }

  async count (): Promise<number> {
    return await this.BotModel.countDocuments()
  }

  async show (id: string, voteLog = false, ownerData = false): Promise<Bot | undefined> {
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

  async showAll (pesquisa: string, sort = 'recent', pagina = 1, limite = 18): Promise<Bot[]> {
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
      botsFormated.push(new Bot(bot, false))
    }
    return botsFormated
  }

  async add (bot: CreateBotDto, userPayload: RequestUserPayload): Promise<Bot> {
    const botElement = new this.BotModel(bot)
    botElement.owner = userPayload.userId
    const { isHTML, longDescription } = bot.details
    if (!_.isEmpty(longDescription)) {
      botElement.details.htmlDescription = (isHTML) ? xss(longDescription) : md().render(longDescription)
    }
    const botTrated = await updateDiscordData(botElement, this.discordService, this.avatarService)
    if (botTrated === undefined) {
      throw new Error('Discord Retornou dados invalidos.')
    }
    await botTrated.save()
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

  async resetVotes (): Promise<void> {
    await this.BotModel.updateMany({}, {
      'votes.current': 0,
      'votes.voteslog': []
    }).exec()
  }
}
