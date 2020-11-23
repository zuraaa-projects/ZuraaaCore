import { Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards, Res, Delete, Header, Put } from "@nestjs/common";
import { Query, Req } from "@nestjs/common/decorators/http/route-params.decorator";
import { BotService } from "src/modules/bots/bot.service";
import { SvgCreator } from "src/utils/svg-creator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Response } from 'express'
import _ from 'lodash'
import { User } from "../users/schemas/User.schema";
import { RequestUserPayload, RoleLevel } from "../auth/jwt.payload";

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

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: string, @Req() req: Express.Request){
        const { role, userId } = req.user as RequestUserPayload
        const bot = await this.botService.show(id, false)
        if(role >= RoleLevel.adm || (bot && bot.owner == userId))
            return {
                deleted: await this.botService.delete(id)
            }
        else
            throw new HttpException('You do not have sufficient permission to remove this bot.', HttpStatus.UNAUTHORIZED)
    }

    @Put('')
    @UseGuards(JwtAuthGuard)
    async updateAllBots(@Query('type') type: string, @Req() req: Express.Request){
        const { role } = req.user as RequestUserPayload
        if(role == RoleLevel.owner){
            if(type == "resetVotes"){
                return await this.botService.resetVotes();
            }
        }else{
            throw new HttpException('You do not have sufficient permission to use this endpoint.', HttpStatus.UNAUTHORIZED)
        }
    }

    @Get()
    async showAll(@Query('type') type: string){
        if(type === 'count')
            return {
                bots_count: await this.botService.count()
            }
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    async add(){
        //return this.botService.add(bot, req.user as RequestUserPayload)
    }

    
    @Get(':id/shield')
    @Header('Cache-Control', 'no-cache')
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