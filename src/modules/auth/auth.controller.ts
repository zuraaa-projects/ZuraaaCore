import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { jwt } from '../../../config.json'

@Controller('auth')
export default class AuthController{
    constructor(private readonly authService: AuthService){}

    @Post('user')
    async login(@Body('code') code: string, @Body('identify') identify: string){
        if(jwt.authorized_clients.findIndex(x => x == identify) == -1)
            throw new HttpException('The application is not authorized to use this endpoint.', HttpStatus.NOT_ACCEPTABLE)


        const userLogged = await this.authService.validateUser(code).catch(() => {
            throw new HttpException('\'code\' is invalid.', HttpStatus.BAD_REQUEST)
        })


        return this.authService.login(userLogged)
    }
}