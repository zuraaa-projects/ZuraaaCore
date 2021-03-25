import { Prop, Schema } from '@nestjs/mongoose'

@Schema()
export class JwtToken {
  @Prop()
  token!: string

  @Prop({
    type: Date,
    default: Date.now
  })
  created!: Date
}
