import { Type } from 'class-transformer'
import { IsNotEmpty, IsObject, Length, ValidateNested } from 'class-validator'
import DetailsBotDto from './details-bot.dto'

export default class CreateBotDto{
    @Length(16, 19)
    _id!: string

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => DetailsBotDto)
    details!: DetailsBotDto

}