import DiscordUser from 'src/extension-modules/discord/interfaces/DiscordUser'

export function getImageUrl ({
  avatar,
  discriminator,
  id
}: DiscordUser): string {
  if (avatar == null) {
    const number = parseInt(discriminator) % 5
    return `https://cdn.discordapp.com/embed/avatars/${number}.png`
  }

  const isAnimatedAvatar = avatar.startsWith('a_')
  const avatarExtension = (isAnimatedAvatar) ? '.gif' : '.webp?size=1024'
  return `https://cdn.discordapp.com/avatars/${id}/${avatar}${avatarExtension}`
}
