import { Module } from '@nestjs/common'
import { ReportService } from './report.service'

@Module({
  imports: [
    ReportService
  ],
  providers: [
    ReportService
  ],
  exports: [
    ReportService
  ]
})
export class ReportModule {}
