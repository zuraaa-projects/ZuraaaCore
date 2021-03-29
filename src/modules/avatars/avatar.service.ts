import { Injectable, OnModuleInit } from '@nestjs/common'
import { join } from 'path'
import { stat } from 'fs'
import { mkdir, readdir, readFile, writeFile, rmdir } from 'fs/promises'
import Image from './interfaces/Image'

@Injectable()
export class AvatarService implements OnModuleInit {
  readonly cachePath = join(process.cwd(), 'cache', 'avatars')

  onModuleInit (): void {
    stat(this.cachePath, (err) => {
      if (err != null) {
        mkdir(this.cachePath, { recursive: true }).catch(console.error)
      }
    })
  }

  async getAvatarFile (id: string, avatarHash: string): Promise<string | undefined> {
    try {
      const files = await readdir(join(this.cachePath, id, avatarHash))
      return files[0]
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error('Pasta não encontrada')
      }
    }
  }

  async getAvatar (id: string, avatarHash: string): Promise<Image | undefined> {
    const file = await this.getAvatarFile(id, avatarHash)
    if (file != null) {
      const data = await readFile(join(this.cachePath, id, avatarHash, file))
      return {
        type: file,
        data
      }
    }
  }

  async writeAvatar (id: string, extension: string, avatarHash: string, avatar: Buffer): Promise<void> {
    const folder = join(this.cachePath, id, avatarHash)

    await this.deleteAvatar(id)
    await mkdir(folder, { recursive: true })
    await writeFile(join(folder, `${extension}`), avatar)
  }

  async deleteAvatar (id: string): Promise<void> {
    const folder = join(this.cachePath, id)
    try {
      await rmdir(folder, {
        recursive: true
      })
    } catch (error) {
      console.error(`Falha ao remover cache (${id})`)
    }
  }
}
