// import Axios from 'axios'
import Axios from 'axios'
import { Document } from 'mongoose'
import { DiscordBotService } from 'src/extension-modules/discord/discord-bot.service'
import DiscordUser from 'src/extension-modules/discord/interfaces/DiscordUser'
import { AvatarService } from 'src/modules/avatars/avatar.service'
import { getImageUrl } from './get-image-url'

export interface BaseDiscordSchema {
  avatar: string
  username: string
  discriminator: string
  _id: string
}

export async function updateDiscordData<Doc extends Document> (
  doc: Doc & BaseDiscordSchema,
  discordService: DiscordBotService | DiscordUser,
  avatarService: AvatarService
): Promise<Doc | undefined> {
  try {
    let discordUser: DiscordUser | undefined
    if (discordService instanceof DiscordBotService) {
      discordUser = await discordService.getUser(doc._id)
    } else {
      discordUser = discordService
    }

    doc.username = discordUser.username
    doc.discriminator = discordUser.discriminator
    if (discordUser.avatar !== doc.avatar || await avatarService.getAvatarFile(doc._id) === undefined) {
      const avatarUrl = getImageUrl(discordUser)
      const response = await Axios.get(avatarUrl, {
        responseType: 'arraybuffer'
      })

      const extension = response.headers['content-type'].split('/')[1]

      await avatarService.writeAvatar(doc._id, extension, response.data)

      doc.avatar = discordUser.avatar
    }

    if (discordUser === undefined) {
      return
    }

    return await doc.save()
  } catch (err) {
    console.error(err)
    return doc
  }
}
