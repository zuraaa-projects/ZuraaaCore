import { Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards, Request, Res } from "@nestjs/common";
import { Body, Query } from "@nestjs/common/decorators/http/route-params.decorator";
import { BotService } from "src/modules/bots/bot.service";
import CreateBotDto from "src/modules/bots/dtos/created-edited/bot.dto";
import { SvgCreator } from "src/utils/svg-creator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RequestUserPayload } from "../auth/jwt.payload";
import { Response } from 'express'

@Controller('bots')
export default class BotController{
    constructor(private readonly botService: BotService){}

    @Get(':id')
    async show(@Param('id') id: string, @Query('avatarBuffer') showAvatar: boolean){
        const bot =  this.botService.show(id, showAvatar, true)
        if(!bot)
            throw new HttpException('Bot was not found.', HttpStatus.NOT_FOUND)

        return bot
    }

    @Get()
    async showAll(@Query("sort") organizar: string,  @Query("search") pesquisa: string, @Query("page") pagina: number, @Query("limit") limit: string /* eu ja expliquei isso na outra classe */){
        return this.botService.showAll(organizar, pesquisa, pagina, limit);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async add(@Body() bot: CreateBotDto, @Request() req: Express.Request){
        return this.botService.add(bot, req.user as RequestUserPayload)
    }

    @Get(':id/shild')
    async shild(@Param('id') id: string, @Res() res: Response){
        const svgCreator = new SvgCreator()

        const bot = await this.botService.show(id, false, false)

        if(!bot)
            throw new HttpException('Not found', HttpStatus.NOT_FOUND)

        
        return res.set('content-type', 'image/svg+xml').send(svgCreator.tinyUpvoteShild(bot))
    }
}