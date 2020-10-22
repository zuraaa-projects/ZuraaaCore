import { Module } from "@nestjs/common";
import { BotModule } from "./bots/bot.module";
import { UserModule } from "./users/User.module";

@Module({
    imports:[
        UserModule,
        BotModule
    ]
})
export class LoaderModule{}