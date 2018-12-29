import { Router, NextFunction } from 'express'

import Controller from '../Controller'
import { requireLogin, logout } from '../../middleware'

class LogoutController extends Controller {
    public router: Router

    constructor() {
        super()

        this.router = Router()
        this.routes()
    }

    public routes() {
        this.router.post('/', requireLogin, logout, this.logout)
    }

    private logout = (next: NextFunction): any => {
        return next()
    }
}

export default new LogoutController().router
