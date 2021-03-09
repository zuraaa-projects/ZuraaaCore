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
  }: any, showWebhook: boolean) {
    this.authorization = (showWebhook) ? authorization : undefined
    this.url = (showWebhook) ? url : undefined
    this.type = (showWebhook) ? type : undefined
    this.lastError = (showWebhook) ? lastError : undefined
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
