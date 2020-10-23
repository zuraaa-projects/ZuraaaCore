import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DiscordBotService } from "src/extension-modules/discord/discord-bot.service";
import { updateDiscordData } from "src/utils/discord-update-data";
import { RequestUserPayload } from "../auth/jwt.payload";
import { User } from "../users/schemas/User.schema";
import CreateBotDto from "./dtos/created-edited/bot.dto";
import { Bot, BotDocument } from "./schemas/Bot.schema";
import md from 'markdown-it'
import xss from 'xss'

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

    async show(id: string, avatarBuffer = false, voteLog = false, ownerData = false){
        const result = await this.botModel.findById(id).populate('owner').exec()
        if(!result)
            return
        return new Bot(await updateDiscordData(result, this.discordService), avatarBuffer, voteLog)
    }

    async showAll(sort: string = "recent", pesquisa: string, pagina: number = 1, limite: string = "18" /* N pergunta pq eh uma string, ele n funcionava se eu colocasse o number */) {
        console.log(`Sort: ${sort}, Pesquisa: ${pesquisa}, Pagina: ${pagina}, Limite: ${limite}`)
        let params: any = {};
        let ordenar: any = {};
        if(pesquisa){
            const regex = {$regex: pesquisa, $options: "i"};
            params.$or = [{username: regex}, {"details.shortDescription": regex}];
        }

        if(sort == "recent"){
            ordenar = { "dates.sent": -1 };
        } else if(sort == "mostVoted"){
          ordenar = { "votes.current": -1 };  
        }

        const bots = await this.botModel.find(params).sort(ordenar).limit(parseInt(limite)).skip((pagina-1) * parseInt(limite)).exec();
        let botsFormated: Bot[] = []
        
        for(const bot of bots){
            botsFormated.push(new Bot(bot, false, false))
        }

        return botsFormated
    }

    async add(bot: CreateBotDto, userPayload: RequestUserPayload){
        const botElement = new this.botModel(bot)
        botElement.owner = userPayload.userId
        const { isHTML, longDescription } = bot.details
        botElement.details.htmlDescription = (isHTML) ? xss(longDescription) : md().render(longDescription)
        const botTrated = await updateDiscordData(botElement, this.discordService)
        if(!botTrated)
            throw new Error ('Discord Retornou dados invalidos.')
        botTrated.save()
        return new Bot(botElement, false, false)
    }
}