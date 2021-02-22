import { Injectable, OnModuleInit } from '@nestjs/common'
import { join } from 'path'
import { stat } from 'fs'
import { mkdir, readdir, readFile, rm, writeFile } from 'fs/promises'
import Image from './interfaces/Image'

@Injectable()
export class AvatarService implements OnModuleInit {
  readonly cachePath = join(process.cwd(), 'cache/avatars')

  onModuleInit (): void {
    stat(this.cachePath, (err) => {
      if (err !== null) {
        mkdir(this.cachePath, { recursive: true }).catch(console.error)
      }
    })
  }

  async getAvatarFile (id: string): Promise<string | undefined> {
    try {
      const files = await readdir(join(this.cachePath, id))
      return files[0]
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.error(error)
      }
    }
  }

  async getAvatar (id: string): Promise<Image | undefined> {
    const file = await this.getAvatarFile(id)
    if (file !== undefined) {
      const data = await readFile(join(this.cachePath, id, file))
      return {
        type: file,
        data
      }
    }
  }

  async writeAvatar (id: string, extension: string, avatar: Buffer): Promise<void> {
    const old = await this.getAvatarFile(id)
    const folder = join(this.cachePath, id)
    if (old !== undefined) {
      await rm(join(folder, old))
    } else {
      await mkdir(folder)
    }
    await writeFile(join(folder, `${extension}`), avatar)
  }
}
