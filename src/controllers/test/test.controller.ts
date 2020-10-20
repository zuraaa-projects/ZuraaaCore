import { Controller, Get, Session } from "@nestjs/common";
import { DiscordBotService } from "src/extension-modules/discord/discord-bot.service";

@Controller('test')
export default class TestController{
    constructor(private readonly discordBot: DiscordBotService){}
    @Get()
    async index(@Session() { user }: Express.Session){
        return user
    }
}