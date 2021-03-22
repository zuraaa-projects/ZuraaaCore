import { Injectable, OnModuleInit } from '@nestjs/common'
import { Channel, connect, Connection } from 'amqplib'
import { v4 as uuid } from 'uuid'
import DiscordUser from './interfaces/discord-user'
import { rabbit } from '../../../config.json'
import NodeCache from 'node-cache'

@Injectable()
export class MessageService implements OnModuleInit {
  connection?: Connection
  channel?: Channel
  cache = new NodeCache()

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

        setTimeout(() => {
          reject(new Error('falhou no tempo'))
        }, 20000)
      } else {
        reject(new Error('Queue undefinied'))
      }
    })
  }

  async getUser (id: string): Promise<DiscordUser> {
    let user = this.cache.get<DiscordUser>(id)
    if (user === undefined) {
      try {
        user = JSON.parse(await this.send(id, 'getUser'))
        if (user == null) {
          console.error('Fail get user')
        }
        this.cache.set(id, user, 3600)
      } catch (error) {
        console.error('Fail get user')
      }
    }

    return user as DiscordUser
  }
}
