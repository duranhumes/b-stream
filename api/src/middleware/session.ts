import * as expressSession from 'express-session'
import * as redis from 'redis'
import * as uuid from 'uuid/v4'
import * as connectRedis from 'connect-redis'

const RedisStore = connectRedis(expressSession)
const isProduction = process.env.NODE_ENV === 'production'
const redisClient = redis.createClient(String(process.env.REDIS_CONNECTION))

export const session = () =>
    expressSession({
        genid: () => uuid(),
        name: String(process.env.REDIS_SESSION_NAME),
        secret: String(process.env.REDIS_SESSION_SECRET),
        saveUninitialized: false,
        resave: false,
        store: new RedisStore({
            host: '127.0.0.1',
            port: 6379,
            client: redisClient,
            logErrors: !isProduction,
            prefix: String(process.env.REDIS_SESSION_NAME),
        }),
        cookie: {
            path: '/',
            httpOnly: false,
            secure: isProduction,
            expires: new Date(
                Date.now() + Number(process.env.REDIS_SESSION_EXPIRE)
            ),
            maxAge: Number(process.env.REDIS_SESSION_EXPIRE),
            domain: String(process.env.WEB_CLIENT_URL),
            sameSite: true,
        },
        unset: 'destroy',
    })
