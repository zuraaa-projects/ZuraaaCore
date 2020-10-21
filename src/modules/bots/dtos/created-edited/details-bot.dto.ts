import { MaxLength, IsNotEmpty, IsEnum } from 'class-validator'
import { AppLibrary, TagsType } from "../../schemas/BotDetails.schema"

export default class DetailsBot{
    @MaxLength(15, {
        message: '"prefixo" pode ter no máximo 15 caracteres.'
    })
    @IsNotEmpty({
        message: '"prefixo" é requerido.'
    })
    prefix!: string

    @IsNotEmpty({
        message: '"tags" é requerida.',
        each: true
    })
    @MaxLength(6, {
        message: 'Você so pode cadastrar 6 "tags"',
        each: true
    })
    tags!: TagsType[]

    @IsNotEmpty({
        message: '"library" é requerida'
    })
    library!: AppLibrary


        
}