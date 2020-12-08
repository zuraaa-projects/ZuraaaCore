// ! TEMPORÁRIO
// TODO: Arranjar uma forma de não precisar desse disable
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Prop, Schema } from '@nestjs/mongoose'

@Schema()
export default class BotDate {
  constructor ({
    sent,
    approved
  }: any) {
    this.sent = sent
    this.approved = approved
  }

  @Prop({
    default: Date.now(),
    type: Date
  })
  sent: Date

  @Prop()
  approved: Date
}
