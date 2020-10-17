import { Prop, Schema } from "@nestjs/mongoose";

@Schema()
export default class AvatarBuffer{
    @Prop()
    data: Buffer

    @Prop()
    contentType: string
}