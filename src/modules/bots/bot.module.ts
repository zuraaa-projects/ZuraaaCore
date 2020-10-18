import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DiscordModule } from "src/extension-modules/discord/discord.module";
import { BotService } from "./bot.service";
import { Bot, BotSchema } from "./schemas/Bot.schema";

@Module({
    imports: [
        DiscordModule,
        MongooseModule.forFeature([
            {
                name: Bot.name,
                schema: BotSchema
            }
        ])
    ],
    providers: [
        BotService
    ],
    exports: [BotService]
})
export class BotModule{}