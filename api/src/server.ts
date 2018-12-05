import * as compression from 'compression'
import * as express from 'express'
import * as morgan from 'morgan'
import * as helmet from 'helmet'
import * as cors from 'cors'
import * as passport from 'passport'
import * as rateLimit from 'express-rate-limit'

import { controllers } from './controllers'
import { logger } from './lib/utils/logging'
import { passportConfig } from './lib/middleware/passport'
import { session } from './lib/middleware/session'

morgan.token('id', req => req.ip)

class Server {
    public app: express.Application

    public constructor() {
        this.app = express()
        this.config()
        this.routes()
    }

    private config() {
        if (process.env.NODE_ENV === 'production') {
            this.app.enable('trust proxy')
        }
        this.app.use(
            new rateLimit({
                windowMs: 15 * 60 * 1000, // 15 mins
                max: 100, // upto 100 requests every 15 mins
            })
        )
        this.app.disable('x-powered-by')
        this.app.use(helmet())
        this.app.use(express.urlencoded({ extended: true, limit: '50mb' }))
        this.app.use(express.json({ limit: '50mb' }))
        this.app.use(compression())
        const loggerFormat =
            ':id [:date[web]] ":method :url" :status :response-time'
        this.app.use(
            morgan(loggerFormat, {
                stream: process.stderr,
            })
        )
        this.app.use(
            cors({
                credentials: true,
                origin: String(process.env.WEB_CLIENT_URL),
            })
        )
        passportConfig()
        this.app.use(session())
        this.app.use(passport.initialize())
        this.app.use(passport.session())
    }

    private routes() {
        const router = express.Router()

        this.app.use('/v1', router)

        // Only allow JSON requests to server
        router.use((req, res, next) => {
            const contentType = req.headers['content-type']
            if (req.method !== 'GET') {
                const allowedContentTypes = [
                    'application/json',
                    'multipart/form-data',
                    'application/x-www-form-urlencoded',
                ]
                const contentTypeMatches = contentType
                    ? allowedContentTypes.filter(s => s.includes(contentType))
                    : []
                if (!contentType || contentTypeMatches.length === 0) {
                    logger(req.ip, req.statusMessage, req.statusCode)

                    return res.status(406).json({
                        response: {},
                        message: `This API only accepts ${allowedContentTypes.join(
                            ', '
                        )} content types for everything except GET requests.`,
                    })
                }
            }

            return next()
        })

        router.use('/login', controllers.LoginController)
        router.use('/logout', controllers.LogoutController)
        router.use('/users', controllers.UserController)

        // To prevent 404 if using the API in browser
        const noContentUrls = ['/favicon.ico', '/robots.txt']
        noContentUrls.forEach(url => {
            router.all(url, (_, res) => res.sendStatus(204))
        })

        // Catch straggling errors
        router.use(
            (
                err: any,
                req: express.Request,
                res: express.Response,
                next: express.NextFunction
            ) => {
                logger(req.ip, req.statusMessage, req.statusCode)
                if (err && err.message) {
                    res.status(500).json({
                        response: {},
                        message: err.message,
                    })

                    return next()
                }

                res.status(404).json({
                    response: {},
                    message: 'Not found.',
                })

                return next()
            }
        )
    }
}

export default new Server().app
