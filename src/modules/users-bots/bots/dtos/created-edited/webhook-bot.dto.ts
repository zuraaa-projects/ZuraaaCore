import { MaxLength, IsEnum, IsOptional, ValidateIf, IsUrl } from 'class-validator'
import { WebhookTypes } from '../../enums/webhook.enums'

export default class WebhookBotDto {
  @IsOptional()
  @MaxLength(2083)
  authorization!: string

  @ValidateIf(x => x.type !== WebhookTypes.Disabled)
  @IsUrl()
  url!: string

  @IsEnum(WebhookTypes)
  type!: WebhookTypes
}
