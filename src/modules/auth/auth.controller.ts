import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { DiscordBotService } from "src/extension-modules/discord/discord-bot.service";
import { UserService } from "../users/User.service";
import { AuthService } from "./auth.service";

@Controller('auth')
export default class AuthController{
    constructor(private readonly authService: AuthService){}

    @Post('user')
    async login(@Body('code') code: string){
        const userLogged = await this.authService.validateUser(code).catch(err => {
            throw new HttpException('\'code\' se encontra invalido ou não foi definido.', HttpStatus.BAD_REQUEST)
        })


        return this.authService.login(userLogged)
    }
}