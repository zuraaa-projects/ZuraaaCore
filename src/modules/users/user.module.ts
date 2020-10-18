import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DiscordModule } from "src/extension-modules/discord/discord.module";
import { User, UserSchema } from "./schemas/User.schema";
import { UserService } from "./User.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema
            }
        ]),
        DiscordModule
    ],
    providers: [
        UserService
    ],
    exports: [UserService]
})
export class UserModule{}