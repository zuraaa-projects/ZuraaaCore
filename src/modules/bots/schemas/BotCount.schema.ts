import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export default class BotCount {
    constructor({
        guild
    }: any){
        this.guild = guild
    }

    @Prop()
    guild: number
}