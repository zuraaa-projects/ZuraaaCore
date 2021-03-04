// ! TEMPORÁRIO
// TODO: Arranjar uma forma de não precisar desse disable
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import UserDate from './UserDate.schema'
import UserDetails from './UserDetails.schema'

@Schema({
  collection: 'users'
})
export class User {
  constructor ({
    _id,
    username,
    discriminator,
    avatar,
    dates,
    details
  }: any) {
    this._id = _id
    this.username = username
    this.discriminator = discriminator
    this.avatar = avatar
    this.dates = dates
    this.details = new UserDetails(details)
  }

  @Prop()
  _id: string

  @Prop({
    required: true,
    index: true
  })
  username: string

  @Prop({
    required: true
  })
  discriminator: string

  @Prop()
  avatar: string

  @Prop(UserDate)
  dates: UserDate

  @Prop(UserDetails)
  details: UserDetails
}

export type UserDocument = User & Document

export const UserSchema = SchemaFactory.createForClass(User)
