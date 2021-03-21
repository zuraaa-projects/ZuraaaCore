import { MaxLength, IsEnum, IsOptional, ValidateIf, IsUrl, IsNumber, Max, Min } from 'class-validator'
import { WebhookTypes } from 'src/modules/users-bots/bots/enums/webhook.enums'

export default class TestWebhookDto {
  @IsOptional()
  @MaxLength(2083)
  authorization?: string

  @ValidateIf(x => x.type !== WebhookTypes.Disabled)
  @IsUrl()
  url!: string

  @IsNumber()
  @Max(2)
  @Min(1)
  type!: WebhookTypes
}
