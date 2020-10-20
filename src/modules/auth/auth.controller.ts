import { Controller, Post, UseGuards, Request } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Controller('auth')
export default class AuthController{
    @UseGuards(AuthGuard('local'))
    @Post('user')
    async login(@Request() req: Express.Request){
        return req.user
    }
}