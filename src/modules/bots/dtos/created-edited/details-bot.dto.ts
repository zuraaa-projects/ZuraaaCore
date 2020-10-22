import { MaxLength, IsNotEmpty, Length, IsEnum, ArrayMaxSize, ArrayMinSize } from 'class-validator'
import { AppLibrary, BotsTags } from '../../enums/details.enums'

export default class DetailsBotDto{
    @Length(1, 15)
    prefix!: string

    @ArrayMaxSize(6)
    @ArrayMinSize(1)
    @IsEnum(BotsTags, {
        each: true
    })
    tags!: BotsTags[]

    @IsNotEmpty()
    @IsEnum(AppLibrary)
    library!: AppLibrary


    @MaxLength(255)
    customInviteLink!: string

    @Length(3, 300)
    shortDescription!: string

    @MaxLength(100000)
    longDescription!: string

    @IsNotEmpty()
    isHTML!: boolean
    

    @MaxLength(10)
    supportServer!: string

    @MaxLength(255)
    website!: string


    @MaxLength(5, {
        each: true,
    })
    otherOwners!: string[]
    
}