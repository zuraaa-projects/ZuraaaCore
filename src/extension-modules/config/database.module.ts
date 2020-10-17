import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { EnviromentModule } from './enviroment.module'

@Module({
    imports: [
        EnviromentModule,
        MongooseModule.forRootAsync({
            async useFactory(configService: ConfigService){
                return {
                    uri: configService.get<string>('MONGO_URI')
                }
            },
            inject: [ConfigService]
        })
    ]
})
export class DatabaseModule{}