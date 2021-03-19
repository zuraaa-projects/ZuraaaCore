import { IsNotEmptyObject, IsOptional, Length, ValidateNested } from 'class-validator'
import DetailsBotDto from './details-bot.dto'
import WebhookBotDto from './webhook-bot.dto'
import { Type } from 'class-transformer'

export default class CreateBotDto {
  @Length(16, 19)
  _id!: string

  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => DetailsBotDto)
  details!: DetailsBotDto

  @IsOptional()
  @ValidateNested()
  @Type(() => WebhookBotDto)
  webhook!: WebhookBotDto
}
