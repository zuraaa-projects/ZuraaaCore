import { Module } from '@nestjs/common'
import { Bots_UsersModule } from './bots-users.module'

@Module({
  imports: [
    Bots_UsersModule
  ]
})
export class LoaderModule {}
