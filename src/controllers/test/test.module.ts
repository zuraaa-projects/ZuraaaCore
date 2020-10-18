import { Module } from "@nestjs/common";
import { DiscordModule } from "src/extension-modules/discord/discord.module";
import TestController from "./test.controller";

@Module({
    imports: [DiscordModule],
    controllers: [TestController]
})
export class TestModule{}