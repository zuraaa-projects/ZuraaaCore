import { Bot } from 'src/modules/users-bots/bots/schemas/Bot.schema'
import { User } from 'src/modules/users-bots/users/schemas/User.schema'

export function avatarFormat (user: Bot | User): string {
  const avatarHash = user.avatar

  if (avatarHash == null) {
    const number = Number(user.discriminator) % 5
    return `https://cdn.discordapp.com/embed/avatars/${number}.png`
  }

  const isAnimatedAvatar = avatarHash.startsWith('a_')
  const avatarExtension = isAnimatedAvatar ? '.gif' : '.webp?size=1024'
  const userId = user._id

  return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}${avatarExtension}`
}
