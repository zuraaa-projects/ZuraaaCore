import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { RouterModule } from "./controllers/router.module";
import { DatabaseModule } from "./extension-modules/config/database.module";
import { AuthModule } from "./modules/auth/auth.module";


@Module({
    imports: [
        DatabaseModule,
        AuthModule,
        RouterModule        
    ]
})
export class AppModule{}