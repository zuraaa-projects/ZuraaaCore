// ! TEMPORÁRIO
// TODO: Arranjar uma forma de não precisar desse disable
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { User } from '../../users/schemas/User.schema'
import BotDate from './BotDate.schema'
import { BotDetails } from './BotDetails.schema'
import BotVotes from './BotVotes.schema'
import BotWebhook from './BotWebhook.schema'

@Schema({
  collection: 'bots'
})
export class Bot {
  constructor ({
    _id,
    username,
    discriminator,
    avatar,
    status,
    owner,
    dates,
    details,
    approvedBy,
    votes,
    webhook
  }: any, showVotes: boolean, showWebhook: boolean, userData: boolean) {
    this._id = _id
    this.username = username
    this.discriminator = discriminator
    this.avatar = avatar
    this.status = status
    this.owner = (userData) ? new User(owner, false, false) : owner
    this.dates = new BotDate(dates)
    this.details = new BotDetails(details, userData)
    this.approvedBy = approvedBy
    this.votes = new BotVotes(votes, showVotes)
    if (showWebhook) {
      this.webhook = new BotWebhook(webhook)
    }
  }

  @Prop({
    minlength: 16,
    maxlength: 19
  })
  _id: string

  @Prop({
    required: true,
    maxlength: 32,
    index: true
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
    ref: 'User',
    default: null
  })
  approvedBy: User | string | null

  @Prop(BotVotes)
  votes: BotVotes

  @Prop(BotWebhook)
  webhook!: BotWebhook
}

export type BotStatus = 'dnd' | 'idle' | 'offline' | 'online' | 'streaming'

export type BotDocument = Bot & Document

export const BotSchema = SchemaFactory.createForClass(Bot)
