import { Type } from 'class-transformer'
import { IsNotEmpty, Length, ValidateNested } from 'class-validator'
import DetailsBotDto from './details-bot.dto'

export default class CreateBotDto{
    @Length(16, 19, {
        message: '"id" não segue os padroes do discord.'
    })
    _id!: string

    @ValidateNested()
    @IsNotEmpty()
    details!: DetailsBotDto

}