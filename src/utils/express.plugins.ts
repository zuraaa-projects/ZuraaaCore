import Helmet from 'helmet'
import Session from 'express-session'
import MongoSession from 'connect-mongodb-session'
import { env } from 'process'

export const helmet = Helmet({
    referrerPolicy: {
        policy: 'no-referrer'
    },
    dnsPrefetchControl: {
        allow: false
    },
    frameguard: {
        action: 'sameorigin'
    },
    permittedCrossDomainPolicies: false,
    contentSecurityPolicy: false,
    hsts: false
})

export function configSession(){
    const mongoSession = MongoSession(Session)
    const sessionStorage = new mongoSession({
        uri: env.mongo_uri,
        collection: 'usersession'
    })

    if(!env.session_secret)
        throw new Error('Invalid SESSION_SECRET')
    
    return Session({
        secret: env.session_secret,
        store: sessionStorage,
        resave: true,
        saveUninitialized: false
    })
}