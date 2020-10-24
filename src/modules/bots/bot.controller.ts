import { Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards, Request, Res } from "@nestjs/common";
import { Body, Query } from "@nestjs/common/decorators/http/route-params.decorator";
import { BotService } from "src/modules/bots/bot.service";
import CreateBotDto from "src/modules/bots/dtos/created-edited/bot.dto";
import { SvgCreator } from "src/utils/svg-creator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RequestUserPayload } from "../auth/jwt.payload";
import { Response } from 'express'
import _ from 'lodash'
import { User } from "../users/schemas/User.schema";

@Controller('bots')
export default class BotController{
    constructor(private readonly botService: BotService){}

    @Get(':id')
    async show(@Param('id') id: string, @Query('avatarBuffer') showAvatar: boolean){
        const bot =  await this.botService.show(id, showAvatar, true)
        if(!bot || _.isEmpty(bot))
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

    @Get(':id/shield')
    async shild(@Param('id') id: string, @Res() res: Response, @Query('type') type: string){
        const svgCreator = new SvgCreator()

        const bot = await this.botService.show(id, false, false, true)

        if(!bot)
            throw new HttpException('Bot was not found.', HttpStatus.NOT_FOUND)

        let svg = ''
        switch(type){
            case 'tinyOwnerBot':
                const {username, discriminator, _id} = bot.owner as User
                svg = svgCreator.tinyOwnerShield(username + '#' + discriminator, _id)
                break
            default: 
                svg = svgCreator.tinyUpvoteShild(bot.votes.current, bot._id)
                break
        }

        
        return res.set('content-type', 'image/svg+xml').send(svg)
    }
}