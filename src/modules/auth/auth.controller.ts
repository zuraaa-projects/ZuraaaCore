import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { jwt } from '../../../config.json'
import { User } from "../users/schemas/User.schema";

@Controller('auth')
export default class AuthController{
    constructor(private readonly authService: AuthService){}

    @Post('user')
    async login(@Body() data: {
        type?: string,
        identify: string,
        data: string
    }){
        if(jwt.authorized_clients.findIndex(x => x == data.identify) == -1)
            throw new HttpException('The application is not authorized to use this endpoint.', HttpStatus.NOT_ACCEPTABLE)

        let userLogged: User
        
        if(data.type === 'bot')
            userLogged = await this.authService.getUser(data.data)
        else
            userLogged = await this.authService.validateUser(data.data).catch(() => {
                throw new HttpException('\'data\' is invalid.', HttpStatus.BAD_REQUEST)
            })


        return this.authService.login(userLogged)
    }
}