import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { DiscordModule } from "src/extension-modules/discord/discord.module";
import { UserModule } from "../users/User.module";
import AuthController from "./auth.controller";
import { JwtModule } from '@nestjs/jwt'
import { env } from "process";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";

const secret = env.jwt_secret


@Module({
    imports: [
        DiscordModule,
        UserModule,
        PassportModule,
        JwtModule.register({
            secret,
            signOptions: {
                expiresIn: '604800s'
            }
        })        
    ],
    controllers: [
        AuthController
    ],
    providers: [
        AuthService,
        JwtStrategy
    ],
    exports: [
        AuthService
    ]
})
export class AuthModule{}