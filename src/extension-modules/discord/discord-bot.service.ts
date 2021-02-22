import { Injectable } from '@nestjs/common'
import Axios, { AxiosInstance } from 'axios'
import NodeCache from 'node-cache'
import { discord } from '../../../config.json'

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
}

// ! TEMPORÁRIO
// TODO: Arranjar uma forma de não precisar desse disable
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class DiscordUtils {
  static getImageUrl ({
    avatar,
    discriminator,
    id
  }: DiscordUser): string {
    if (avatar === undefined) {
      const number = parseInt(discriminator) % 5
      return `https://cdn.discordapp.com/embed/avatars/${number}.png`
    }

    const isAnimatedAvatar = avatar.startsWith('a_')
    const avatarExtension = (isAnimatedAvatar) ? '.gif' : '.webp?size=1024'
    return `https://cdn.discordapp.com/avatars/${id}/${avatar}${avatarExtension}`
  }
}

export interface DiscordUser {
  id: string
  username: string
  avatar: string
  discriminator: string
  public_flags: number
  bot: boolean
}
