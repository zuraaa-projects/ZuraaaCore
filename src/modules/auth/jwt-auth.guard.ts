import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { Request } from 'express'
import { RequestUserPayload, RoleLevel } from "./jwt.payload";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){}


@Injectable()
export class JwtAuthRoleGuard implements CanActivate{
    constructor(private readonly reflector: Reflector){}
    
    canActivate(context: ExecutionContext){
        const role = this.reflector.get<RoleLevel>('role', context.getHandler())
        if(!role)
            return true
        const request = context.switchToHttp().getRequest() as Request
        const user = request.user as RequestUserPayload
        
        return user.role >= role
    }
}