import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import axios, { AxiosError } from 'axios'
import { WebhookTypes } from '../users-bots/bots/enums/webhook.enums'
import TestWebhookDto from './dtos/test/test-webhook.sto'

@Injectable()
export default class WebhookService {
  async validateWebhook (webhook: TestWebhookDto, userId: string): Promise<number> {
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
        const { status } = await axios.post(webhook.url, message)
        return status
      } catch (error) {
        if (error.isAxiosError as boolean) {
          const e = error as AxiosError
          return e.response?.status as number
        }
        console.log(error)
        throw new HttpException('Erro ao testar webhook', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    } else if (webhook.type === WebhookTypes.Server) {
      message = {
        user_id: userId,
        bot_id: '745828915993640980',
        votes: '1000000'
      }

      try {
        const { status } = await axios.post(webhook.url, message, {
          headers: {
            Authorization: webhook.authorization
          }
        })
        return status
      } catch (error) {
        if (error.isAxiosError as boolean) {
          const e = error as AxiosError
          return e.response?.status as number
        }
        console.log(error)
        throw new HttpException('Erro ao testar webhook', HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }

    throw new HttpException('Type not implemented', HttpStatus.BAD_REQUEST)
  }
}
