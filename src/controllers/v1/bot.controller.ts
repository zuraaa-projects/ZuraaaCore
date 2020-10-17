import { Controller, Get, HttpException, HttpStatus, Param } from "@nestjs/common";
import { Query } from "@nestjs/common/decorators/http/route-params.decorator";
import { BotService } from "src/modules/bots/bot.service";

@Controller('bots')
export default class BotController{
    constructor(private readonly botService: BotService){}

    @Get(':id')
    async show(@Param('id') id: string, @Query('avatarBuffer') showAvatar: boolean){
        return this.botService.show(id, showAvatar, true).catch(err => {
            throw new HttpException('Bot não encontrado.', HttpStatus.NOT_FOUND)
        })
    }
}