import { Injectable } from '@nestjs/common'
import { DiscordBotService } from 'src/extension-modules/discord/discord-bot.service'
import { UserService } from '../users/User.service'

@Injectable()
export class AuthService{
    constructor(private readonly discordService: DiscordBotService, private readonly userService: UserService){}

    async validateUser(code: string){
        const user = await this.discordService.getUserLogin(code)
        const userDb = await this.userService.login(user)
        return userDb
    }
}