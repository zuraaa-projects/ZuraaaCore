import { Controller, Get, Param, Query } from "@nestjs/common";
import { BotService } from "src/modules/bots/bot.service";
import { UserService } from "src/modules/users/User.service";

@Controller('users')
export default class UserController {
    constructor(private readonly userService: UserService, private readonly botService: BotService){}
    @Get(':id')
    async show(@Param('id') id: string, @Query('avatarBuffer') avatarBuffer: boolean){
        return this.userService.show(id, avatarBuffer)
    }

    @Get()
    async test(){
        return this.botService.show()
    }
}