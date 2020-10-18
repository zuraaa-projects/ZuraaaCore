import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { RouterModule } from "./controllers/router.module";
import { DatabaseModule } from "./extension-modules/config/database.module";


@Module({
    imports: [
        DatabaseModule,
        RouterModule        
    ]
})
export class AppModule{}