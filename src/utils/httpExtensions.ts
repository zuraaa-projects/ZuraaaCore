// ! TEMPORÁRIO
// TODO: Arranjar uma forma de não precisar desse disable
/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchServers } from 'config.json'

export async function fetchServerCount (id: string): Promise<number> {
  if (fetchServers.activated) {
    const response = await fetch(`${fetchServers.url}/api/bots/${id}`)
    if (response.status === 200) {
      return (await response.json()).guildCount
    }
    return 0
  } else {
    return 0
  }
}
