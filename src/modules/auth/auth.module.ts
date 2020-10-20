import { Module } from "@nestjs/common";
import { DiscordModule } from "src/extension-modules/discord/discord.module";
import { UserModule } from "../users/User.module";
import AuthController from "./auth.controller";
import { AuthService } from "./auth.service";
import { LocalStrategy } from "./local.strategy";

@Module({
    imports: [
        DiscordModule,
        UserModule
    ],
    providers: [
        AuthService,
        LocalStrategy
    ],
    controllers: [
        AuthController
    ]
})
export class AuthModule{}