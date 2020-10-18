import { Module } from "@nestjs/common";
import TestController from "./test/test.controller";
import { TestModule } from "./test/test.module";
import { V1Module } from "./v1/v1.module";

@Module({
    imports:[
        V1Module,
        TestModule
    ]
})
export class RouterModule{}