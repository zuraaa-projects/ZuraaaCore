import { Injectable, OnModuleInit } from '@nestjs/common'
import { Channel, connect, Connection } from 'amqplib'
import { v4 as uuid } from 'uuid'
import DiscordUser from './interfaces/discord-user'
import { rabbit } from '../../../config.json'

@Injectable()
export class MessageService implements OnModuleInit {
  connection?: Connection
  channel?: Channel

  async onModuleInit (): Promise<void> {
    this.connection = await connect(rabbit.url)
    this.channel = await this.connection.createChannel()
  }

  async send (buffer: string, queue: string): Promise<string> {
    const assert = await this.channel?.assertQueue('')
    return await new Promise((resolve, reject) => {
      if (assert !== undefined) {
        const id = uuid()

        this.channel?.consume(assert.queue, msg => {
          if (msg !== null) {
            if (msg.properties.correlationId === id) {
              resolve(msg.content.toString())
            } else {
              reject(new Error('Uuid not match'))
            }
          } else {
            reject(new Error('Message null'))
          }
        }).catch(reject)

        this.channel?.sendToQueue(queue, Buffer.from(buffer), {
          correlationId: id,
          replyTo: assert?.queue
        })
      } else {
        reject(new Error('Queue undefinied'))
      }
    })
  }

  async getUser (id: string): Promise<DiscordUser> {
    const user = await this.send(id, 'getUser')

    return JSON.parse(user)
  }
}
