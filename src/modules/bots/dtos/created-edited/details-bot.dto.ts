import { MaxLength, IsNotEmpty, Length } from 'class-validator'
import { AppLibrary, TagsType } from "../../schemas/BotDetails.schema"

export default class DetailsBotDto{
    @Length(1, 15, {
        message: '"prefixo" deve ter 1 á 15 caracteres.'
    })
    prefix!: string

    @Length(1, 6, {
        message: 'Você deve cadastrar de 1 á 6 "tags"',
        each: true
    })
    tags!: TagsType[]

    @IsNotEmpty({
        message: '"library" é requerida'
    })
    library!: AppLibrary


    @MaxLength(255, {
        message: '"customInviteLink" excedeu o limite de caracteres.'
    })
    customInviteLink!: string

    @Length(3, 300, {
        message: '"shortDescription" não obedece os limites de tamanho 3-300 caracteres.'
    })
    shortDescription!: string

    @MaxLength(100000, {
        message: '"longDescription" é passou de 100000 caracteres.'
    })
    longDescription!: string

    @IsNotEmpty({
        message: '"isHTML" é requerido.'
    })
    isHTML!: boolean
    

    @MaxLength(10, {
        message: '"supportServer" não tem formato valido para um convite discord.'
    })
    supportServer!: string

    @MaxLength(255, {
        message: '"website" é maior que 255 caracters.'
    })
    website!: string


    @MaxLength(5, {
        each: true,
        message: '"otherOwners" so pode conter 6 itens.'
    })
    otherOwners!: string[]
    
}