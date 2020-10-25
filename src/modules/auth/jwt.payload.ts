export interface JwtPayload{
    role: RoleLevel,
    sub: string
}

export interface RequestUserPayload{
    userId: string
    role: RoleLevel
}

export enum RoleLevel{
    user,
    checker,
    adm,
    owner
}