// import Axios from 'axios'
import Axios from 'axios'
import { Document } from 'mongoose'
import { DiscordBotService } from 'src/extension-modules/discord/discord-bot.service'
import DiscordUser from 'src/extension-modules/discord/interfaces/DiscordUser'
import { AvatarService } from 'src/modules/avatars/avatar.service'
import { getImageUrl } from './get-image-url'
import mime from 'mime-types'
import { MessageService } from 'src/extension-modules/messages/messages.service'

export interface BaseDiscordSchema {
  avatar: string
  username: string
  discriminator: string
  _id: string
}

export async function updateDiscordData<Doc extends Document> (
  doc: Doc & BaseDiscordSchema,
  discordService: DiscordBotService | DiscordUser | MessageService,
  avatarService: AvatarService,
  getError = false
): Promise<Doc | undefined> {
  try {
    let discordUser: DiscordUser | undefined
    if (discordService instanceof DiscordBotService) {
      discordUser = await discordService.getUser(doc._id)
    } else if (discordService instanceof MessageService) {
      discordUser = await discordService.getUser(doc._id)
    } else {
      discordUser = discordService
    }

    doc.username = discordUser.username
    doc.discriminator = discordUser.discriminator
    if (discordUser.avatar !== doc.avatar || await avatarService.getAvatarFile(doc._id, discordUser.avatar) == null) {
      const avatarUrl = getImageUrl(discordUser)
      const response = await Axios.get(avatarUrl, {
        responseType: 'arraybuffer'
      })

      const extension = mime.extension(response.headers['content-type'])

      await avatarService.writeAvatar(doc._id, extension as string, discordUser.avatar, response.data)

      doc.avatar = discordUser.avatar
    }

    if (discordUser == null) {
      return
    }

    return await doc.save()
  } catch (err) {
    if (getError) {
      console.log(err)
      return undefined
    }
    console.log(err)

    return doc
  }
}
