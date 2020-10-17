import { Prop, Schema } from "@nestjs/mongoose";
import { User } from "src/modules/users/schemas/User.schema";

@Schema()
export default class BotVotes{
    constructor({
        current,
        voteslog
    }: any, showVotes: boolean){
        this.current = current
        this.voteslog = (showVotes) ? voteslog : undefined
    }

    @Prop({
        default: 0
    })
    current: number

    @Prop([String])
    voteslog: string[]
}