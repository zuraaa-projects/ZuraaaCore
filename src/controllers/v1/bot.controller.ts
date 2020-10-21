import { Controller, Get, HttpException, HttpStatus, Param, Post } from "@nestjs/common";
import { Body, Query } from "@nestjs/common/decorators/http/route-params.decorator";
import { get } from "http";
import { BotService } from "src/modules/bots/bot.service";
import CreateBotDto from "src/modules/bots/dtos/created-edited/bot.dto";

@Controller('bots')
export default class BotController{
    constructor(private readonly botService: BotService){}

    @Get(':id')
    async show(@Param('id') id: string, @Query('avatarBuffer') showAvatar: boolean){
        const bot =  this.botService.show(id, showAvatar, true)
        if(!bot)
            throw new HttpException('Bot não encontrado.', HttpStatus.NOT_FOUND)

        return bot
    }

    @Get()
    async showAll(@Query("sort") organizar: string,  @Query("search") pesquisa: string, @Query("page") pagina: number, @Query("limit") limit: string /* eu ja expliquei isso na outra classe */){
        return this.botService.showAll(organizar, pesquisa, pagina, limit);
    }

    @Post()
    async add(@Body() bot: CreateBotDto){
        return bot
    }
}