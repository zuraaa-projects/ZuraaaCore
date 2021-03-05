import { MaxLength, IsEnum, IsOptional, ValidateIf, isURL } from 'class-validator'
import { WebhookTypes } from '../../enums/webhook.enums'

export default class DetailsBotDto {
  @IsOptional()
  @MaxLength(2083)
  authorization!: string

  @ValidateIf(x => x.type !== 0 && isURL(x.url))
  url!: string

  @IsOptional()
  @IsEnum(WebhookTypes)
  type!: WebhookTypes
}
