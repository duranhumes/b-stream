import { Router, Response } from 'express'

import Controller from '../Controller'
import { promisify, filterEntity } from '../../utils'
import { logger } from '../../utils/logging'
import { verifyPassword } from '../../auth/password'
import { UserServices } from '../../services/UserServices'
import * as httpMessages from '../../utils/httpMessages'
import { validationFunc, validationRules } from './validation'
import { ExtendedRequest } from '../../interfaces/ExtendedRequest'

class LoginController extends Controller {
    public router: Router

    constructor() {
        super()

        this.router = Router()
        this.routes()
    }

    public routes() {
        this.router.post(
            '/',
            [...validationRules.basicLogin],
            validationFunc,
            this.basicLogin
        )
    }

    /**
     * Login a user with required fields
     * @field email
     * @field password
     */
    private basicLogin = async (
        req: ExtendedRequest,
        res: Response
    ): Promise<any> => {
        interface Login {
            email: string
            password: string
        }
        const data = {}
        for (const key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                data[key] = this.escapeString(req.body[key]).trim()
            }
        }

        const { email, password } = data as Login

        /**
         * Check if user exists, if not return 404
         * otherwise proceed.
         */
        const [user, userErr]: [any, any] = await promisify(
            UserServices.findOne('email', email.toLowerCase(), false)
        )
        if (userErr) {
            if (userErr.code === 404) {
                logger(req.ip, userErr, 404)

                return res.status(404).json(httpMessages.code404())
            }

            logger(req.ip, userErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        /**
         * Check if found users password matches the password
         * supplied to this endpoint
         */
        const [verified, verifiedErr] = await promisify(
            verifyPassword(user.password, password)
        )
        if (verifiedErr) {
            logger(req.ip, verifiedErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        if (!verified) {
            return res.status(401).json(httpMessages.code401())
        }

        /**
         * Login user, send user info back
         * along with jsonwebtoken as a way to
         * verify who the user is in
         * subsequent requests
         */
        const filteredUserObj: any = filterEntity(user)
        req.login(filteredUserObj.id, (err: any) => {
            if (err) {
                logger(req.ip, err, 500)

                return res.status(500).json(httpMessages.code500())
            }

            req.session!.user = filteredUserObj.id
            res.setHeader('XSRF-TOKEN', String(req.sessionID))
            const response = filteredUserObj
            return res.status(200).json(httpMessages.code200(response))
        })

        return
    }
}

export default new LoginController().router
