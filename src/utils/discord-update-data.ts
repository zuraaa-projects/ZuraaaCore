import Axios from 'axios'
import { Document } from 'mongoose'
import { DiscordBotService, DiscordUser, DiscordUtils } from 'src/extension-modules/discord/discord-bot.service'

export async function updateDiscordData<Doc extends Document>(doc: Doc & BaseDiscordSchema, discordService: DiscordBotService | DiscordUser){
    try{
        let discordUser: DiscordUser
        if(discordService instanceof DiscordBotService)
            discordUser = await discordService.getUser(doc._id)
        else 
            discordUser = discordService
        
        doc.username = discordUser.username 
        doc.discriminator = discordUser.discriminator
        /*
        if(discordUser.avatar != doc.avatar || !(doc.avatarBuffer && doc.avatarBuffer.contentType)){
            
            const avatarUrl = DiscordUtils.getImageUrl(discordUser)
            const response = await Axios.get(avatarUrl, {
                responseType: 'arraybuffer'
            })

            doc.avatarBuffer = {
                contentType: response.headers['content-type'],
                data: Buffer.from(response.data)
            }

            doc.avatar = discordUser.avatar
        }*/

        if(!discordUser)
            return

        return doc.save()
 
    }catch(err){
        console.error(err)
        return doc
    }
}

export interface BaseDiscordSchema{
    avatarBuffer: {
        contentType: string,
        data: Buffer
    }
    avatar: string
    username: string
    discriminator: string
    _id: string
}
