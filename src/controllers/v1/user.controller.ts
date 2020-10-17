import { Controller, Get, HttpException, HttpStatus, Param, Query, Res } from "@nestjs/common";
import { BotService } from "src/modules/bots/bot.service";
import { UserService } from "src/modules/users/User.service";

@Controller('users')
export default class UserController {
    constructor(private readonly userService: UserService, private readonly botService: BotService){}
    @Get(':id')
    async show(@Param('id') id: string, @Query('avatarBuffer') avatarBuffer: boolean){
        return this.userService.show(id, avatarBuffer)
    }

    @Get(':id/bots')
    async getBots(@Param('id') id: string){
        const user = await this.userService.show(id, false).catch(err => {
            throw new HttpException('Usuario não encontrado', HttpStatus.NOT_FOUND)
        })
        
        return this.botService.getBotsByOwner(user)
    }
    
}