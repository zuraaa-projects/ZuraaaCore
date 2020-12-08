// ! TEMPORÁRIO
// TODO: Arranjar uma forma de não precisar desse disable
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Prop, Schema } from '@nestjs/mongoose'

@Schema()
export default class BotCount {
  constructor ({
    guild
  }: any) {
    this.guild = guild
  }

  @Prop()
  guild: number
}
