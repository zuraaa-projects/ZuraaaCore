import { Type } from 'class-transformer'
import { IsNotEmptyObject, IsOptional, ValidateNested } from 'class-validator'
import UpdateDetailsBotDto from './update-details-bot.dto'
import UpdateWebhookBotDto from './update-webhook-bot.dto'

export default class UpdateBotDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => UpdateDetailsBotDto)
  details!: UpdateDetailsBotDto

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateWebhookBotDto)
  webhook!: UpdateWebhookBotDto
}
