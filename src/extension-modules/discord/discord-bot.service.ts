import { HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Axios, { AxiosInstance } from "axios";

@Injectable()
export class DiscordBotService{
    private api: AxiosInstance
    private baseUrl = 'https://discord.com/api/v8'
    
    constructor(private readonly configService: ConfigService){
        this.api = Axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bot ' + configService.get<string>('DISCORD_BOT_TOKEN')
            }
        })
    }

    async getUser(id: string){
        return (await this.api.get('/users/' + id)).data as DiscordUser
    }

    async getUserLogin(code: string){
        const params = new URLSearchParams()
        params.append('client_id', this.configService.get<string>('DISCORD_APP_ID'))
        params.append('client_secret', this.configService.get<string>('DISCORD_APP_SECRET'))
        params.append('grant_type', 'authorization_code')
        params.append('scope', this.configService.get<string>('DISCORD_APP_SCOPE'))
        params.append('redirect_uri', this.configService.get<string>('DISCORD_APP_REDIRECT_URI'))
        params.append('code', code)

        const { data: tokenUser } = await Axios.post('/oauth2/token', params.toString(), {
            baseURL: this.baseUrl,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })

        const {data: userDiscord} = await Axios.get('/users/@me', {
            headers: {
                'Authorization': 'Bearer ' + tokenUser.access_token
            },
            baseURL: this.baseUrl
        })

        return userDiscord as DiscordUser
    }
}

export class DiscordUtils{
    static getImageUrl({
        avatar,
        discriminator,
        id
    }: DiscordUser): string{
        if(!avatar){
            const number = parseInt(discriminator) % 5
            return `https://cdn.discordapp.com/embed/avatars/${number}.png`
        }

        const isAnimatedAvatar = avatar.startsWith('a_')
        const avatarExtension = (isAnimatedAvatar) ? '.gif' : '.webp?size=1024'
        return `https://cdn.discordapp.com/avatars/${id}/${avatar}${avatarExtension}`
    }
}


export interface DiscordUser{
    id: string
    username: string
    avatar: string
    discriminator: string
    public_flags: number
    bot: boolean
}