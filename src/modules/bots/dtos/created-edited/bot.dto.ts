import { Type } from 'class-transformer'
import { IsNotEmptyObject, Length, ValidateNested } from 'class-validator'
import DetailsBotDto from './details-bot.dto'

export default class CreateBotDto {
  @Length(16, 19)
  _id!: string

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => DetailsBotDto)
  details!: DetailsBotDto
}
