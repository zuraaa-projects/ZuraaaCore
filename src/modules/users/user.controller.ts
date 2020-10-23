import { Controller, Get, HttpException, HttpStatus, Param, Query, Res } from "@nestjs/common";
import { BotService } from "src/modules/bots/bot.service";
import { UserService } from "src/modules/users/user.service";
import _ from 'lodash'

@Controller('users')
export default class UserController {
    constructor(private readonly userService: UserService, private readonly botService: BotService){}
    @Get(':id')
    async show(@Param('id') id: string, @Query('avatarBuffer') avatarBuffer: boolean){
        const user = await this.userService.show(id, avatarBuffer)

        if(!user || _.isEmpty(user)) 
            throw new HttpException('Usuario não encontrado.', HttpStatus.NOT_FOUND)
        
        return user
    }

    @Get(':id/bots')
    async getBots(@Param('id') id: string){
        const user = await this.userService.show(id, false)
            
        if(!user || _.isEmpty(user))
            throw new HttpException('Usuario não encontrado.', HttpStatus.NOT_FOUND)
        
        return this.botService.getBotsByOwner(user)
    }
    
}