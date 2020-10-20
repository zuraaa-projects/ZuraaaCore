import Helmet from 'helmet'
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