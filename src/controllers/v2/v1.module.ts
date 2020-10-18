import { Module } from "@nestjs/common";
import { BotModule } from "src/modules/bots/bot.module";
import { UserModule } from "src/modules/users/User.module";
import BotController from "./bot.controller";
import UserController from "./user.controller";

@Module({
    imports: [
        UserModule,
        BotModule
    ],
    controllers: [
        UserController,
        BotController
    ]
})
export class V1Module{}