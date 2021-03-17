export default interface DiscordUser {
  id: string
  username: string
  avatar: string
  discriminator: string
  public_flags: number
  bot: boolean
}
