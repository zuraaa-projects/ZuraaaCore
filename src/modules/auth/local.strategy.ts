import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PassportStrategy } from '@nestjs/passport'
import  Strategy from 'passport-auth-token'


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy as any){
    constructor(private readonly authService: AuthService){
        super({
            tokenFields: ['code']
        })
    }

    async validate(token: string){
        const user = await this.authService.validateUser(token).catch(err => {
            console.error(token)
            throw new UnauthorizedException()
        })

        return user
    }
}