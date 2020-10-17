import { Prop, Schema } from "@nestjs/mongoose";
import { User } from "src/modules/users/schemas/User.schema";

@Schema()
export class BotDetails{

    constructor({
        prefix,
        tags,
        library,
        customInviteLink,
        shortDescription,
        longDescription,
        htmlDescription,
        supportServer,
        website,
        otherOwners,
        customURL
    }: any){
        this.prefix = prefix
        this.tags = tags
        this.library = library
        this.customInviteLink = customInviteLink
        this.shortDescription = shortDescription
        this.longDescription = longDescription
        this.htmlDescription = htmlDescription
        this.supportServer = supportServer
        this.website = website
        this.otherOwners = otherOwners
        this.customURL = customURL
    }

    @Prop({
        required: true,
        maxlength: 15
    })
    prefix: string

    @Prop({
        required: true
    })
    tags: TagsType[]

    @Prop({
        required: true
    })
    library: AppLibrary

    @Prop({
        maxlength: 255
    })
    customInviteLink: string

    @Prop({
        required: true,
        minlength: 3,
        maxlength: 300
    })
    shortDescription: string

    @Prop({
        maxlength: 10000
    })
    longDescription: string

    @Prop({
        maxlength: 100000
    })
    htmlDescription: string

    @Prop({
        maxlength: 10
    })
    supportServer: string

    @Prop({
        maxlength: 255
    })
    website: string

    @Prop({
        type: String,
        ref: 'User'
    })
    otherOwners: User[] | string[]

    @Prop({
        maxlength: 255
    })
    customURL: string
}


export type TagsType = 'anime' | 'dashboard' | 'diversao' | 'utilidades' | 'social' | 'jogos' | 'musica' | 'moderacao' | 'economia' | 'fortnite' | 'lol' | 'minecraft' | 'hytale' | 'nfsw' | 'outros'

export type AppLibrary = 'discord.js' | 'discord.py' | 'discordCr' | 'discord.io' | 'eris' | 'RestCord' | 'Discordia' | 'nyx' | 'serenity' | 'discordie' | 'DiscordPHP' | 'Sword' | 'DiscordUnity' | 'litcord' | 'discord-hs' | 'discordrb' | 'Discord.Net' | 'JDA' | 'Javacord' | 'discord-rs' | 'DSharpPlus' | 'dscord' | 'DiscordGo' | 'DisGord' | 'Discord4j' | 'discordnim' | 'Yasmin' | 'disco' | 'AckCord' | 'Bot Designer' | 'DBM' | 'Outro'