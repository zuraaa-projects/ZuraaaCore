import { Body, Controller, HttpException, HttpStatus, Post, Req, Session } from "@nestjs/common";
import { DiscordBotService } from "src/extension-modules/discord/discord-bot.service";
import { UserService } from "../users/User.service";

@Controller('auth')
export default class AuthController{
    constructor(private readonly discordService: DiscordBotService, private readonly userService: UserService){}

    @Post('user')
    async userLogin(@Body('code') code: string, @Session() session: Express.Session){        
        const user = await this.discordService.getUserLogin(code).catch(() => {
            throw new HttpException('\'code\' é invalido.', HttpStatus.BAD_REQUEST)
        })

        session.user = await this.userService.login(user)
        session.save(console.error)
        return session.id
    }
}