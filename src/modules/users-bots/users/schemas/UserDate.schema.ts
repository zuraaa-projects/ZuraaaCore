import { Prop, Schema } from '@nestjs/mongoose'

@Schema()
export default class UserDate {
  @Prop({
    default: Date.now(),
    type: Date
  })
  firstSeen!: Date

  @Prop({
    type: Date,
    default: null
  })
  lastBotAdd!: Date | null

  @Prop({
    type: Date,
    default: null
  })
  nextVote!: Date | null
}
