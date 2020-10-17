import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "../users/schemas/User.schema";
import { Bot, BotDocument } from "./schemas/Bot.schema";

@Injectable()
export class BotService {
    constructor(@InjectModel(Bot.name) private readonly botModel: Model<BotDocument>){}

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
        return new Bot(await this.botModel.findById(id).exec(), avatarBuffer, voteLog)
    }
}