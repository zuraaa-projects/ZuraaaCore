import { Prop, Schema } from "@nestjs/mongoose";
import { User } from "src/modules/users/schemas/User.schema";

@Schema()
export default class BotVotes{
    constructor({
        current,
        voteslog
    }: any){
        this.current = current
        this.voteslog = voteslog
    }

    @Prop({
        default: 0
    })
    current: number

    @Prop({
        ref: 'Users',
        type: String
    })
    voteslog: User[] | string[]
}