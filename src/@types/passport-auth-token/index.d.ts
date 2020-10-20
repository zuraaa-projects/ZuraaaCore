declare module 'passport-auth-token'{
    import { Type } from '@nestjs/passport'

    function lookup(obj: any, field: string, options: any[]): any | null
    function Strategy(options: any, verify: Function): Type<any>
    
    export = Strategy

}

