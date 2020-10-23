import { Module } from "@nestjs/common";
import { BotModule } from "./bots/bot.module";
import { UserModule } from "./users/user.module";

@Module({
    imports:[
        UserModule,
        BotModule
    ]
})
export class LoaderModule{}