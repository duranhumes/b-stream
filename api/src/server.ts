import * as compression from 'compression'
import * as express from 'express'
import * as morgan from 'morgan'
import * as helmet from 'helmet'
import * as cors from 'cors'
import * as passport from 'passport'
import * as rateLimit from 'express-rate-limit'
import * as busboy from 'connect-busboy'
import * as busboyBodyParser from 'busboy-body-parser'

import { controllers } from './controllers'
import { logger } from './utils/logging'
import { passportConfig } from './middleware/passport'
import { session } from './middleware/session'

morgan.token('id', req => req.ip)

class Server {
    public app: express.Application

    constructor() {
        this.app = express()
        this.config()
        this.routes()
    }

    private config() {
        if (process.env.NODE_ENV === 'production') {
            this.app.enable('trust proxy')
        }
        this.app.disable('x-powered-by')
        this.app.use(
            new rateLimit({
                windowMs: 15 * 60 * 1000, // 15 mins
                max: 100, // upto 100 requests every 15 mins
                message: {
                    status: 429,
                    error: 'To many requests',
                    message: 'To many requests, try again later',
                },
            })
        )
        this.app.use(helmet())
        this.app.use(
            cors({
                credentials: true,
                origin: String(process.env.WEB_CLIENT_URL),
            })
        )
        this.app.use(
            busboy({
                immediate: true,
                highWaterMark: 2 * 1024 * 1024, // 2mb
                limits: {
                    fileSize: 10 * 1024 * 1024, // 10mb
                },
            })
        )
        this.app.use(express.urlencoded({ extended: true, limit: '10mb' }))
        this.app.use(express.json({ limit: '10mb' }))
        this.app.use(busboyBodyParser())
        this.app.use(compression())
        const loggerFormat =
            ':id [:date[web]] ":method :url" :status :response-time'
        this.app.use(
            morgan(loggerFormat, {
                stream: process.stderr,
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

        // Only allow specific content types
        router.use((req, res, next) => {
            const contentType = req.headers['content-type']
            if (req.method !== 'GET') {
                const allowedContentTypes = [
                    'application/json',
                    'multipart/form-data',
                ]
                const contentTypeMatches = contentType
                    ? allowedContentTypes.filter(s => contentType.includes(s))
                    : []
                if (!contentType || contentTypeMatches.length === 0) {
                    logger(req.ip, req.statusMessage, req.statusCode)

                    return res.status(406).json({
                        status: 406,
                        error: 'Bad Content-Type Header',
                        message: `This API only accepts ${allowedContentTypes.join(
                            ', '
                        )} content types for everything except GET requests.`,
                    })
                }
            }

            return next()
        })

        router.get(
            '/health',
            (_: any, res: express.Response, next: express.NextFunction) => {
                res.sendStatus(200)

                return next()
            }
        )
        router.use('/login', controllers.LoginController)
        router.use('/logout', controllers.LogoutController)
        router.use('/users', controllers.UserController)
        router.use('/tracks', controllers.TrackController)
        router.use('/albums', controllers.AlbumController)

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
