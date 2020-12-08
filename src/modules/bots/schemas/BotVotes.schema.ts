// ! TEMPORÁRIO
// TODO: Arranjar uma forma de não precisar desse disable
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Prop, Schema } from '@nestjs/mongoose'
@Schema()
export default class BotVotes {
  constructor ({
    current,
    voteslog
  }: any, showVotes: boolean) {
    this.current = current
    this.voteslog = (showVotes) ? voteslog : undefined
  }

  @Prop({
    default: 0
  })
  current: number

  @Prop([String])
  voteslog: string[]
}
