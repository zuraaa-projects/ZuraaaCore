import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DiscordModule } from "src/extension-modules/discord/discord.module";
import { UserModule } from "../users/User.module";
import AuthController from "./auth.controller";

@Module({
    imports: [
        ConfigModule,
        DiscordModule,
        UserModule
    ],
    controllers: [
        AuthController
    ]
})
export class AuthModule{}