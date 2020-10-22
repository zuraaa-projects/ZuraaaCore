import { Injectable } from "@nestjs/common";
import { DiscordBotService } from "src/extension-modules/discord/discord-bot.service";
import { UserService } from "../users/User.service";
import { JwtService } from '@nestjs/jwt'
import { User } from "../users/schemas/User.schema";
import { JwtPayload } from "./jwt.payload";

@Injectable()
export class AuthService {
    constructor (private readonly discordService: DiscordBotService,
        private readonly userService: UserService,
        private readonly jwtService: JwtService) {}

    
    async validateUser(code: string){
        const discordUser = await this.discordService.getUserLogin(code)

        const userDb = await this.userService.login(discordUser)

        return userDb
    }


    async login(user: User){
        return {
            access_token: this.jwtService.sign({
                username: user.username,
                sub: user._id
            } as JwtPayload)
        }
    }
}