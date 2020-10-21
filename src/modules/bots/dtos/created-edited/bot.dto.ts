import { IsNotEmpty, Length, MinLength } from 'class-validator'

export default class CreateBotDto{
    @IsNotEmpty({
        message: '"id" é requerido.',
    })
    @Length(16, 19, {
        message: '"id" é muito longa para o padrão id do discord.'
    })
    @MinLength(16, {
        message: '"id" é muito curta para o padrão id do discord.'
    })
    _id!: string

    
    

}