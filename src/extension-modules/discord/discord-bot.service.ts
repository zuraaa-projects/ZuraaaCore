import { Injectable } from '@nestjs/common'
import Axios, { AxiosInstance } from 'axios'
import _ from 'lodash'
import NodeCache from 'node-cache'
import { BotReport } from 'src/modules/users-bots/bots/dtos/report/bot-report'
import { Bot } from 'src/modules/users-bots/bots/schemas/Bot.schema'
import { User } from 'src/modules/users-bots/users/schemas/User.schema'
import { discord } from '../../../config.json'
import { ReportPath } from '../report/interfaces/ReportPath'
import DiscordUser from './interfaces/DiscordUser'

@Injectable()
export class DiscordBotService {
  private readonly api: AxiosInstance
  private readonly baseUrl = 'https://discord.com/api/v8'
  private readonly botToken: string = discord.bot.token
  private readonly cache = new NodeCache()

  constructor () {
    this.api = Axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bot ' + this.botToken
      }
    })
  }

  async getUser (id: string): Promise<DiscordUser> {
    let user = this.cache.get<DiscordUser>(id)
    if (user === undefined) {
      user = (await this.api.get(`/users/${id}`)).data as DiscordUser
      this.cache.set(id, user, 3600)
    }
    return user
  }

  async getUserLogin (code: string): Promise<DiscordUser> {
    const params = new URLSearchParams()
    params.append('client_id', discord.app.id)
    params.append('client_secret', discord.app.secret)
    params.append('grant_type', 'authorization_code')
    params.append('scope', discord.app.scope)
    params.append('redirect_uri', discord.app.redirect)
    params.append('code', code)

    const { data: tokenUser } = await Axios.post('/oauth2/token', params.toString(), {
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })

    const { data: userDiscord } = await Axios.get('/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenUser.access_token as string}`
      },
      baseURL: this.baseUrl
    })

    return userDiscord as DiscordUser
  }

  async sendReport (botReport: BotReport, files: ReportPath[], bot: Bot, user: User): Promise<void> {
    const fields = [
      {
        name: 'Enviado por:',
        value: `${user.username}#${user.discriminator} (${user._id})`,
        inline: true
      },
      {
        name: 'Tópico:',
        value: botReport.topic,
        inline: true
      },
      {
        name: 'Motivo:',
        value: botReport.reason
      }
    ]

    if (!_.isEmpty(files)) {
      const url = discord.url.apiBaseUrl + `/bots/${bot._id}/reports/`

      fields.push({
        name: 'Arquivos',
        value: files.reduce((result, value) => result + `[Reporte-${value.id}](${url + value.fileName})\n`, '')
      })
    }

    const embed = {
      content: `<@&${discord.roles.admRole}>`,
      embed: {
        title: `Denúncia contra ${bot.username}#${bot.discriminator}`,
        color: 0xff0000,
        fields: fields,
        footer: {
          text: `ID: ${bot._id}`
        }
      }
    }

    await this.api.post(`/channels/${discord.channels.logReport}/messages`, embed)
  }

  async sendVote (user: User, bot: Bot): Promise<void> {
    await this.api.post(`/channels/${discord.channels.logVote}/messages`, {
      content: `${user.username}#${user.discriminator} (${user._id}) votou no bot \`${bot.username}#${bot.discriminator}\`\n` +
        `${discord.url.siteBaseUrl}/bots/${(bot.details.customURL !== null) ? bot.details.customURL : bot._id}`
    })
  }

  async banUser (user: User, author: User, reason: string): Promise<void> {
    const message = (_.isEmpty(reason)) ? 'Sem motivo informado.' : reason

    const embed = {
      embed: {
        title: `${author.username}#${author.discriminator} baniu ${user.username}#${user.discriminator} (${user._id})`,
        description: `Motivo: \`${message}\``,
        color: 0xff0000,
      }
    }

    await this.api.post(`/channels/${discord.channels.logBan}/messages`, embed)
  }

  async unbanUser (user: User, author: User): Promise<void> {
    const embed = {
      embed: {
        title: `${author.username}#${author.discriminator} desbaniu ${user.username}#${user.discriminator} (${user._id})`,
        color: 0xff0000,
      }
    }

    await this.api.post(`/channels/${discord.channels.logBan}/messages`, embed)
  }
}
