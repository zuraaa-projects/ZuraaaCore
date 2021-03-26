// ! TEMPORÁRIO
// TODO: Arranjar uma forma de não precisar desse disable
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Prop, Schema } from '@nestjs/mongoose'

@Schema()
export default class BotWebhook {
  constructor ({
    authorization,
    url,
    type,
    lastError
  }: any) {
    this.authorization = authorization
    this.url = url
    this.type = type
    this.lastError = lastError
  }

  @Prop({
    default: null,
    type: String
  })
  authorization: string | null

  @Prop({
    default: null,
    type: String
  })
  url: string | null

  @Prop({
    default: 0
  })
  type: number

  @Prop({
    default: false
  })
  lastError: boolean
}
