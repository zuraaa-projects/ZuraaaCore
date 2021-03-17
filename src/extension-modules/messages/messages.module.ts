import { Module } from '@nestjs/common'
import { MessageService } from './messages.service'

@Module({
  imports: [
    MessageService
  ],
  providers: [
    MessageService
  ],
  exports: [
    MessageService
  ]
})
export class MessageModule {}
