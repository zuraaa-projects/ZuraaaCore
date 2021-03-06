import { IsEnum, IsNotEmpty } from 'class-validator'
import { ReportTopic } from '../../enums/topics.enums'

export class BotReport {
  @IsEnum(ReportTopic)
  topic!: ReportTopic

  @IsNotEmpty()
  reason!: string
}
