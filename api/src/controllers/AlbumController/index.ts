import { Router, Request, Response } from 'express'

import Controller from '../Controller'
import { validationFunc, validationRules } from './validation'

class AlbumController extends Controller {
    public router: Router

    public constructor() {
        super()

        this.router = Router()
        this.routes()
    }

    public routes() {
        this.router.post(
            '/',
            [...validationRules.getAlbum],
            validationFunc,
            this.getAlbum
        )
    }

    private getAlbum = async (req: Request, res: Response): Promise<any> => {
        console.log(req, res)
    }
}

export default new AlbumController().router
