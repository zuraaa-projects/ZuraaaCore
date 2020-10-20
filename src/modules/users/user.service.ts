import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose'
import { Model } from "mongoose";
import { DiscordBotService, DiscordUser } from "src/extension-modules/discord/discord-bot.service";
import { updateDiscordData } from "src/utils/discord-update-data";
import { User, UserDocument } from "./schemas/User.schema";

@Injectable()
export class UserService{
    constructor (@InjectModel(User.name) private readonly userModel: Model<UserDocument>, private readonly discordService: DiscordBotService){}

    async create(user: User){
        const userCreated = new this.userModel(user)
        return userCreated.save()
    }
    
    async show(id: string, avatarBuffer = false){
        const result = await this.userModel.findById(id).exec()
        if(!result)
            return
        return new User(await updateDiscordData(result, this.discordService), avatarBuffer)
    }

    async login(user: DiscordUser){
        const findUser = await this.userModel.findById(user.id).exec()
        if(findUser)
            return new User(await updateDiscordData(findUser, user), false)
        
        const userData = new this.userModel({
            _id: user.id
        })

        return new User(await updateDiscordData(userData, user), false)
    }
}