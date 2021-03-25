import { IsOptional } from 'class-validator'

export class RemoveBotDto {
  @IsOptional()
  reason!: string
}
