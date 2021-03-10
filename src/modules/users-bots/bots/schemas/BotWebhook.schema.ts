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

  @Prop()
  authorization: string

  @Prop()
  url: string

  @Prop({
    default: 0
  })
  type: number

  @Prop({
    default: false
  })
  lastError: boolean
}
