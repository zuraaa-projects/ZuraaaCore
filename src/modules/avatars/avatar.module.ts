import { Module } from '@nestjs/common'
import AvatarController from './avatar.controller'
import { AvatarService } from './avatar.service'

@Module({
  controllers: [
    AvatarController
  ],
  providers: [
    AvatarService
  ],
  exports: [
    AvatarService
  ]
})
export class AvatarModule {}
