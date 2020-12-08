import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { mongo } from '../../../config.json'

@Module({
  imports: [
    MongooseModule.forRoot(mongo.uri)
  ]
})
export class DatabaseModule {}
