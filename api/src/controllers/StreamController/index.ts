import * as fs from 'fs'
import * as path from 'path'
import { Router, Request, Response } from 'express'

import Controller from '../Controller'
import { validationFunc, validationRules } from './validation'

const baseDir = path.normalize(path.resolve(__dirname, '..', '..', '..'))
const storageDir = `${baseDir}/storage`

class StreamController extends Controller {
    public router: Router

    public constructor() {
        super()

        this.router = Router()
        this.routes()
    }

    public routes() {
        this.router.post(
            '/',
            [...validationRules.getStream],
            validationFunc,
            this.getStream
        )
    }

    private getStream = async (req: Request, res: Response): Promise<any> => {
        console.log(req, res)
        const trackId = 1
        const trackName = 1
        const trackExt = 1
        const fileDir = `${storageDir}/${trackId}/${trackName}.${trackExt}`
        res.writeHead(200, { 'Content-Type': `audio/${trackExt}` })
        const stream = fs.createReadStream(fileDir)
        stream.pipe(res)
    }
}

export default new StreamController().router
