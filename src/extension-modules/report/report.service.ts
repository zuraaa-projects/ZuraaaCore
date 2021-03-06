import { Injectable, OnModuleInit } from '@nestjs/common'
import { stat } from 'fs'
import { mkdir, readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import Image from './interfaces/Image'
import { ReportPath } from './interfaces/ReportPath'

@Injectable()
export class ReportService implements OnModuleInit {
  readonly cachePath = join(process.cwd(), 'cache', 'reports')

  onModuleInit (): void {
    stat(this.cachePath, (err) => {
      if (err !== null) {
        mkdir(this.cachePath, { recursive: true }).catch(console.error)
      }
    })
  }

  async writeReport (files: Express.Multer.File[], botId: string): Promise<ReportPath[]> {
    const folder = join(
      this.cachePath,
      botId
    )

    let reportNumber = 0

    try {
      const files = await readdir(folder)
      reportNumber = files.length
    } catch (error) {
      await mkdir(folder, { recursive: true })
    }

    const filesPath: ReportPath[] = []

    for (let i = 0; i < files.length; i++) {
      const x = files[i]
      const fileType = x.mimetype.split('/')[1]
      const fileName = `report-${reportNumber}.${fileType}`
      const fullPath = join(folder, fileName)
      reportNumber += 1

      await writeFile(fullPath, x.buffer)

      filesPath.push({
        id: reportNumber,
        fileName: fileName
      })
    }

    return filesPath
  }

  async readReport (botId: string, fileName: string): Promise<Image> {
    const filePath = join(
      this.cachePath,
      botId,
      fileName
    )
    const file = await readFile(filePath)

    return {
      type: fileName.split('.')[1],
      data: file
    }
  }
}
