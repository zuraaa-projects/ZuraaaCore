import { MaxLength, IsNotEmpty, Length, IsEnum, ArrayMaxSize, ArrayMinSize, IsOptional, IsUrl, IsBoolean } from 'class-validator'
import { AppLibrary, BotsTags } from '../../enums/details.enums'

export default class DetailsBotDto {
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
  @IsOptional()
  customInviteLink!: string

  @Length(3, 300)
  shortDescription!: string

  @IsOptional()
  @MaxLength(100000)
  longDescription!: string

  @IsBoolean()
  isHTML!: boolean

  @IsOptional()
  @MaxLength(20)
  supportServer!: string

  @IsOptional()
  @MaxLength(255)
  website!: string

  @ArrayMaxSize(5)
  @MaxLength(18, {
    each: true
  })
  @IsOptional()
  otherOwners!: string[]

  @IsOptional()
  @MaxLength(2083)
  @IsUrl()
  donate!: string

  @IsOptional()
  @MaxLength(100)
  github!: string
}
