import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Controller('auth')
export default class AuthController{
    constructor(private readonly authService: AuthService){}

    @Post('user')
    async login(@Body('code') code: string){
        const userLogged = await this.authService.validateUser(code).catch(() => {
            throw new HttpException('\'code\' is invalid.', HttpStatus.BAD_REQUEST)
        })


        return this.authService.login(userLogged)
    }
}