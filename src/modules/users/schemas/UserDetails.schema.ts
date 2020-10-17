import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export default class UserDetails {
    constructor({
        description,
        role
    }: any){
        this.description = description
        this.role = role
    }

    @Prop()
    description: string

    @Prop({
        default: 0
    })
    role: number
}