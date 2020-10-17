import { Module } from "@nestjs/common";
import { UserModule } from "src/modules/users/User.module";
import UserController from "./user.controller";

@Module({
    imports: [
        UserModule
    ],
    controllers: [
        UserController
    ]
})
export class V1Module{}