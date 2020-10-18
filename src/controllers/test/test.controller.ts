import { Controller, Get } from "@nestjs/common";
import { DiscordBotService } from "src/extension-modules/discord/discord-bot.service";

@Controller('test')
export default class TestController{
    constructor(private readonly discordBot: DiscordBotService){}
    @Get()
    async index(){
        return this.discordBot.getUser('203713369927057408')
    }
}