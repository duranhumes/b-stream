import { Router, Response } from 'express'

import Controller from '../Controller'
import requireLogin from '../../middleware/requireLogin'
import { ExtendedRequest } from '../../interfaces/ExtendedRequest'

class LogoutController extends Controller {
    public router: Router

    constructor() {
        super()

        this.router = Router()
        this.routes()
    }

    public routes() {
        this.router.post('/', requireLogin, this.logout)
    }

    private logout = (req: ExtendedRequest, res: Response): any => {
        req.logout()
        if (req.session) {
            return req.session.destroy(() => res.sendStatus(200))
        }

        return res.sendStatus(200)
    }
}

export default new LogoutController().router
