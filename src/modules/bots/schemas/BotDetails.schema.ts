// ! TEMPORÁRIO
// TODO: Arranjar uma forma de não precisar desse disable
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Prop, Schema } from '@nestjs/mongoose'
import { AppLibrary, BotsTags } from '../enums/details.enums'

@Schema()
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
    guilds
  }: any) {
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
    this.otherOwners = otherOwners
    this.customURL = customURL
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
    maxlength: 255
  })
  customInviteLink: string

  @Prop({
    required: true,
    minlength: 3,
    maxlength: 300
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
    maxlength: 10
  })
  supportServer: string

  @Prop({
    maxlength: 255
  })
  website: string

  @Prop([String])
  otherOwners: string[]

  @Prop({
    maxlength: 255
  })
  customURL: string

  @Prop({
    required: true,
    default: 0
  })
  guilds: number
}
