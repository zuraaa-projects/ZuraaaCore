import { Body, Controller, Get, HttpException, HttpStatus, Param, Put, Query, Req, UseGuards } from "@nestjs/common";
import { BotService } from "src/modules/bots/bot.service";
import { UserService } from "src/modules/users/user.service";
import _ from 'lodash'
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import UserDto from "./dtos/edit-user/user.dto";
import { RequestUserPayload } from "../auth/jwt.payload";

@Controller('users')
export default class UserController {
    constructor(private readonly userService: UserService, private readonly botService: BotService){}
    @Get(':id')
    async show(@Param('id') id: string, @Query('avatarBuffer') avatarBuffer: boolean){
        const user = await this.userService.show(id, avatarBuffer)

        if(!user || _.isEmpty(user)) 
            throw new HttpException('User was not found.', HttpStatus.NOT_FOUND)
        
        return user
    }

    @Get(':id/bots')
    async getBots(@Param('id') id: string){
        const user = await this.userService.show(id, false)
            
        if(!user || _.isEmpty(user))
            throw new HttpException('User was not found.', HttpStatus.NOT_FOUND)
        
        return this.botService.getBotsByOwner(user)
    }


    @Put('@me')
    @UseGuards(JwtAuthGuard)
    async update(@Body() userData: UserDto, @Req() req: Express.Request){
        const { userId } = req.user as RequestUserPayload

        const updateddata = await this.userService.update(userData, userId)
        if(!updateddata || _.isEmpty(updateddata))
            throw new HttpException('Could not validate the User or Service Discord is unstable.', HttpStatus.INTERNAL_SERVER_ERROR)
        return updateddata
    }
    
}