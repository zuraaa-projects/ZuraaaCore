import { Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards, Res } from "@nestjs/common";
import { Query } from "@nestjs/common/decorators/http/route-params.decorator";
import { BotService } from "src/modules/bots/bot.service";
import { SvgCreator } from "src/utils/svg-creator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Response } from 'express'
import _ from 'lodash'
import { User } from "../users/schemas/User.schema";

@Controller('bots')
export default class BotController{
    constructor(private readonly botService: BotService){}

    @Get(':id')
    async show(@Param('id') id: string, @Query('avatarBuffer') showAvatar: boolean){
        const bot =  await this.botService.show(id, showAvatar, false)
        if(!bot || _.isEmpty(bot))
            throw new HttpException('Bot was not found.', HttpStatus.NOT_FOUND)
        console.log(bot)
        return bot
    }

    @Get()
    async showAll( /* eu ja expliquei isso na outra classe */){
        //return this.botService.showAll(organizar, pesquisa, pagina, limit);
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async add(){
        //return this.botService.add(bot, req.user as RequestUserPayload)
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