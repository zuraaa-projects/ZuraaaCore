import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import AvatarBuffer from '../../AvatarBuffer.schema'
import UserDate from './UserDate.schema'
import UserDetails from './UserDetails.schema'

@Schema({
    collection: 'users'
})
export class User{
    @Prop()
    _id: string

    @Prop({
        required: true
    })
    username: string

    @Prop({
        required: true
    })
    discriminator: string

    @Prop()
    avatar: string

    @Prop(AvatarBuffer)
    avatarBuffer: AvatarBuffer

    @Prop(UserDate)
    dates: UserDate
    

    @Prop(UserDetails)
    details: UserDetails

    static convertToSchema({
        _id,
        username,
        discriminator,
        avatar,
        avatarBuffer,
        dates,
        details
    }: any, enableAvatar: boolean): User{
        const converted = {
            _id,
            username,
            discriminator,
            avatar,
            avatarBuffer,
            dates,
            details: {
                description: details.description,
                role: details.role
            }
        }
        if(!enableAvatar)
            delete converted.avatarBuffer
        return converted
    }
}

export type UserDocument = User & Document

export const UserSchema = SchemaFactory.createForClass(User)