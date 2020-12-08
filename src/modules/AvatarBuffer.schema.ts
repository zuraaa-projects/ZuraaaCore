import { Prop, Schema } from '@nestjs/mongoose'

@Schema()
export default class AvatarBuffer {
  @Prop({
    required: true
  })
  data!: Buffer

  @Prop({
    maxlength: 255,
    required: true
  })
  contentType!: string
}
