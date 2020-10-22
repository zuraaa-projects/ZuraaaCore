import { Module } from "@nestjs/common";
import { LoaderModule } from "./modules/loader.module";
import { DatabaseModule } from "./extension-modules/config/database.module";
import { AuthModule } from "./modules/auth/auth.module";


@Module({
    imports: [
        DatabaseModule,
        AuthModule,
        LoaderModule        
    ]
})
export class AppModule{}