import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DiscordBotService } from "src/extension-modules/discord/discord-bot.service";
import { updateDiscordData } from "src/utils/discord-update-data";
import { User } from "../users/schemas/User.schema";
import { Bot, BotDocument } from "./schemas/Bot.schema";

@Injectable()
export class BotService {
    constructor(@InjectModel(Bot.name) private readonly botModel: Model<BotDocument>, private readonly discordService: DiscordBotService){}

    async getBotsByOwner(owner: User){
        const bots = await this.botModel.find({
            $or: [
                {
                    owner: owner._id
                },
                {
                    'details.otherOwners': owner._id
                }
            ]
        }).exec()
        let botsFormated: Bot[] = []
        
        for(const bot of bots){
            botsFormated.push(new Bot(bot, false, false))
        }

        return botsFormated
    }

    async show(id: string, avatarBuffer = false, voteLog = false){
        const result = await this.botModel.findById(id).exec()
        if(!result)
            return
        return new Bot(await updateDiscordData(result, this.discordService), avatarBuffer, voteLog)
    }

    async showAll() {
        const bots = await this.botModel.find().exec();
        let botsFormated: Bot[] = []
        
        for(const bot of bots){
            botsFormated.push(new Bot(bot, false, false))
        }

        return botsFormated
    }
}