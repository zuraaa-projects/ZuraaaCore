export interface JwtPayload{
    username: string,
    sub: string
}

export interface RequestUserPayload{
    userId: string
    username: string
}