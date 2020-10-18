import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Axios, { AxiosInstance } from "axios";

@Injectable()
export class DiscordBotService{
    private api: AxiosInstance
    
    constructor(configService: ConfigService){
        this.api = Axios.create({
            baseURL: 'https://discord.com/api/v8',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bot ' + configService.get<string>('DISCORD_BOT_TOKEN')
            }
        })
    }

    async getUser(id: string){
        return (await this.api.get('/users/' + id)).data as DiscordUser
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