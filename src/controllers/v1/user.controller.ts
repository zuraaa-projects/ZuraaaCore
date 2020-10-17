import { Controller, Get, Param, Query } from "@nestjs/common";
import { UserService } from "src/modules/users/User.service";

@Controller('users')
export default class UserController {
    constructor(private readonly userService: UserService){}
    @Get(':id')
    async show(@Param('id') id: string, @Query('avatarBuffer') avatarBuffer: boolean){
        return this.userService.show(id, avatarBuffer)
    }
}