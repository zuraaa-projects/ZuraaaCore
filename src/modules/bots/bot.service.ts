import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Bot, BotDocument } from "./schemas/Bot.schema";

@Injectable()
export class BotService {
    constructor(@InjectModel(Bot.name) private readonly botModel: Model<BotDocument>){}

    async show(id: string = '694975753418440844'){
        return new Bot(await this.botModel.findById(id).exec(), false)
    }
}