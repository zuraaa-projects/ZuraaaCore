import { Module } from '@nestjs/common'
import { ThrottlerStorageService } from '@nestjs/throttler'
import WebhookController from './webhook.controller'
import WebhookService from './webhook.service'

@Module({
  imports: [
    ThrottlerStorageService
  ],
  controllers: [
    WebhookController
  ],
  providers: [
    WebhookService,
    ThrottlerStorageService
  ]
})
export class WebhookModule {}
