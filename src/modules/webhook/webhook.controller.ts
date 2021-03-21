import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { RequestUserPayload } from '../auth/jwt.payload'
import TestWebhookDto from './dtos/test/test-webhook.sto'
import { WebhookGuard } from './guards/webhook.guard'
import WebhookService from './webhook.service'

@Controller('webhook')
export default class WebhookController {
  constructor (
    private readonly webhookService: WebhookService
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseGuards(WebhookGuard)
  async testWebhook (@Body() webhook: TestWebhookDto, @Req() req: Express.Request): Promise<{ code: number }> {
    const { userId } = req.user as RequestUserPayload
    const code = await this.webhookService.validateWebhook(webhook, userId)
    return {
      code: code
    }
  }

  // testar webhook custom
  // @Post('test')
  // @UseGuards(JwtAuthGuard)
  // async customWebhook (@Body() foda: any, @Req() req: Express.Request): Promise<void> {
  //   const { userId } = req.user as RequestUserPayload
  //   console.log(userId)
  //   console.log(foda.user_id)
  // }
}
