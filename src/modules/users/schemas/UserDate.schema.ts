import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export default class UserDate{
    @Prop({
        default: Date.now(),
        type: Date
    })
    firstSeen!: Date

    @Prop()
    lastBotAdd!: Date

    @Prop()
    nextVote!: Date
}