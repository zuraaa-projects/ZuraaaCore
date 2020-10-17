import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BotService } from "./bot.service";
import { Bot, BotSchema } from "./schemas/Bot.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Bot.name,
                schema: BotSchema
            }
        ])
    ],
    providers: [BotService],
    exports: [BotService]
})
export class BotModule{}