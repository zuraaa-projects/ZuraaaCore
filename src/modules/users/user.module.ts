import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DiscordModule } from "src/extension-modules/discord/discord.module";
import { BotModule } from "../bots/bot.module";
import { User, UserSchema } from "./schemas/User.schema";
import UserController from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema
            }
        ]),
        DiscordModule,
        BotModule
    ],
    providers: [
        UserService
    ],
    controllers: [
        UserController
    ],
    exports: [
        UserService
    ]
})
export class UserModule{}