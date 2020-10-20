import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { DiscordBotService } from "src/extension-modules/discord/discord-bot.service";
import { JwtAuthGuard } from "src/modules/auth/jwt-auth.guard";

@Controller('test')
export default class TestController{
    constructor(private readonly discordBot: DiscordBotService){}
    @Get()
    @UseGuards(JwtAuthGuard)
    async index(@Request() req: Express.Request){
        return req.user
    }
}