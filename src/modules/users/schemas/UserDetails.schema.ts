// ! TEMPORÁRIO
// TODO: Arranjar uma forma de não precisar desse disable
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prop, Schema } from '@nestjs/mongoose'

@Schema()
export default class UserDetails {
  constructor (
    {
      description,
      role
    }: any
  ) {
    this.description = description
    this.role = role
  }

  @Prop()
  description: string

  @Prop({
    default: 0
  })
  role: number
}
