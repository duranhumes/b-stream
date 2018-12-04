import { Router, Response } from 'express'

import Controller from '../Controller'
import requireLogin from '../../lib/middleware/requireLogin'

class LogoutController extends Controller {
    public router: Router

    public constructor() {
        super()

        this.router = Router()
        this.routes()
    }

    public routes() {
        this.router.post('/', requireLogin, this.logout)
    }

    private logout = (req: any, res: Response): any => {
        req.session = null
        req.logout()
        req.session.destroy(() => res.sendStatus(200))
    }
}

export default new LogoutController().router
