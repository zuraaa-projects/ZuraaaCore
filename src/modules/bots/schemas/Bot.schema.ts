import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { type } from 'os'
import AvatarBuffer from 'src/modules/AvatarBuffer.schema'
import { User } from 'src/modules/users/schemas/User.schema'
import BotCount from './BotCount.schema'
import BotDate from './BotDate.schema'
import { BotDetails } from './BotDetails.schema'
import BotVotes from './BotVotes.schema'

@Schema({
    collection: 'bots'
})
export class Bot {
    constructor({
        _id,
        username,
        discriminator,
        avatar,
        avatarBuffer,
        status,
        owner,
        dates,
        details,
        approvedBy,
        votes,
        count
    }: any, enableAvatar: boolean, showVotes: boolean){
        this._id = _id
        this.username = username,
        this.discriminator = discriminator
        this.avatar = avatar
        this.avatarBuffer = (enableAvatar) ? avatarBuffer : undefined
        this.status = status
        this.owner = owner
        this.dates = new BotDate(dates)
        this.details = new BotDetails(details)
        this.approvedBy = approvedBy
        this.votes = new BotVotes(votes, showVotes)
        this.count = new BotCount(count)
    }


    @Prop({
        minlength: 16,
        maxlength: 19
    })
    _id: string

    @Prop({
        required: true,
        maxlength: 32
    })
    username: string

    @Prop({
        required: true,
        maxlength: 4,
        minlength: 4
    })
    discriminator: string

    @Prop({
        maxlength: 255
    })
    avatar: string

    @Prop(AvatarBuffer)
    avatarBuffer: AvatarBuffer

    @Prop({
        default: 'offline'
    })
    status: BotStatus

    @Prop({
        type: String,
        ref: 'User'
    })
    owner: User | string

    @Prop(BotDate)
    dates: BotDate

    @Prop(BotDetails)
    details: BotDetails

    @Prop({
        type: String,
        ref: 'User'
    })
    approvedBy: User | string

    @Prop(BotVotes)
    votes: BotVotes

    @Prop(BotCount)
    count: BotCount
}

export type BotStatus = 'dnd' | 'idle' | 'offline' | 'online' | 'streaming'

export type BotDocument = Bot & Document

export const BotSchema = SchemaFactory.createForClass(Bot)