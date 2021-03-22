import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import axios from 'axios'
import { WebhookTypes } from '../users-bots/bots/enums/webhook.enums'
import TestWebhookDto from './dtos/test/test-webhook.sto'

@Injectable()
export default class WebhookService {
  async validateWebhook (webhook: TestWebhookDto, userId: string): Promise<boolean> {
    let message
    if (webhook.type === WebhookTypes.Discord) {
      message = {
        embeds: [
          {
            title: 'Votou no Zuraaa! List',
            description: 'Esse é um teste de WebHook do Zuraaa!',
            color: 16777088,
            footer: {
              text: userId
            },
            timestamp: new Date().toISOString(),
            thumbnail: {
              url: 'https://www.zuraaa.com/img/logo.png'
            }
          }
        ]
      }

      try {
        await axios.post(webhook.url, message)
        return true
      } catch {
        return false
      }
    } else if (webhook.type === WebhookTypes.Server) {
      message = {
        user_id: userId,
        bot_id: '745828915993640980',
        votes: '1000000'
      }

      try {
        await axios.post(webhook.url, message, {
          headers: {
            Authorization: webhook.authorization
          }
        })
        return true
      } catch {
        return false
      }
    }

    throw new HttpException('Type not implemented', HttpStatus.BAD_REQUEST)
  }
}
