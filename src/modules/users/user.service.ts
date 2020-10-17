import { Injectable } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose'
import { Model } from "mongoose";
import { User, UserDocument } from "./schemas/User.schema";

@Injectable()
export class UserService{
    constructor (@InjectModel(User.name) private readonly userModel: Model<UserDocument>){}

    async create(user: User){
        const userCreated = new this.userModel(user)
        return userCreated.save()
    }
    
    async show(id: string, avatarBuffer = false): Promise<User>{
        return new User(await this.userModel.findById(id).exec(), avatarBuffer)
    }
}