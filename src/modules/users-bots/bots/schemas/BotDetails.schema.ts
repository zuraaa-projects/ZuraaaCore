// ! TEMPORÁRIO
// TODO: Arranjar uma forma de não precisar desse disable
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Prop, Schema } from '@nestjs/mongoose'
import { User } from '../../users/schemas/User.schema'
import { AppLibrary, BotsTags } from '../enums/details.enums'

@Schema({
})
export class BotDetails {
  constructor ({
    prefix,
    tags,
    library,
    customInviteLink,
    shortDescription,
    longDescription,
    htmlDescription,
    supportServer,
    isHTML,
    website,
    otherOwners,
    customURL,
    donate,
    github,
    guilds
  }: any, userData: boolean) {
    this.prefix = prefix
    this.tags = tags
    this.library = library
    this.customInviteLink = customInviteLink
    this.shortDescription = shortDescription
    this.longDescription = longDescription
    this.htmlDescription = htmlDescription
    this.supportServer = supportServer
    this.website = website
    this.isHTML = isHTML
    if (userData) {
      this.otherOwners = otherOwners.map((x: User) => {
        return new User(x, false, false)
      })
    } else {
      this.otherOwners = otherOwners
    }
    this.customURL = customURL
    this.donate = donate
    this.github = github
    this.guilds = guilds
  }

  @Prop({
    required: true,
    maxlength: 15
  })
  prefix: string

  @Prop({
    required: true
  })
  tags: BotsTags[]

  @Prop({
    required: true
  })
  library: AppLibrary

  @Prop({
    maxlength: 255,
    default: null,
    type: String
  })
  customInviteLink: string | null

  @Prop({
    required: true,
    minlength: 3,
    maxlength: 300,
    index: true
  })
  shortDescription: string

  @Prop({
    maxlength: 10000
  })
  longDescription: string

  @Prop({
    maxlength: 100000
  })
  htmlDescription: string

  @Prop({
    default: false
  })
  isHTML!: boolean

  @Prop({
    maxlength: 10,
    default: null,
    type: String
  })
  supportServer: string | null

  @Prop({
    maxlength: 255,
    default: null,
    type: String
  })
  website: string | null

  @Prop([{
    type: String,
    ref: 'User'
  }])
  otherOwners: string[] | User[]

  @Prop({
    maxlength: 255,
    index: true,
    default: null,
    type: String
  })
  customURL: string | null

  @Prop({
    maxlength: 2083
  })
  donate: string

  @Prop({
    maxlength: 100
  })
  github: string

  @Prop({
    type: Number,
    default: null
  })
  guilds: number
}
