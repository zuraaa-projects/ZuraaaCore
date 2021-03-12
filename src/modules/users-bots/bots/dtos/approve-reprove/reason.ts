import { IsOptional } from 'class-validator'

export default class Reason {
  @IsOptional()
  reason!: string
}
