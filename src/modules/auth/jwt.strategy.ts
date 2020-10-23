import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt'
import { JwtPayload, RequestUserPayload } from "./jwt.payload";
import { jwt } from '../../../config.json'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwt.secret
        })
    }


    async validate(payload: JwtPayload){
        return {
            userId: payload.sub,
            username: payload.username
        } as RequestUserPayload
    }
}