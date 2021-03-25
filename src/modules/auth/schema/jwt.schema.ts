import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { JwtToken } from './jwt-token.schema'

@Schema()
export class Jwt {
  @Prop({
    ref: 'User'
  })
  _id!: string

  @Prop([JwtToken])
  tokens!: JwtToken[]
}

export type JwtDocument = Jwt & Document

export const JwtSchema = SchemaFactory.createForClass(Jwt)
