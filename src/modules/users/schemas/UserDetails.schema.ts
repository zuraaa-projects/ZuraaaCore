import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export default class UserDetails {
    @Prop()
    description: string

    @Prop({
        default: 0
    })
    role: number
}