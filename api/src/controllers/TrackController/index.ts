import * as fs from 'fs'
import * as path from 'path'
import { Router, Request, Response } from 'express'

import Controller from '../Controller'
import * as httpMessages from '../../utils/httpMessages'
import { validationFunc, validationRules } from './validation'
import { pick, promisify } from '../../utils'
import TrackSchema from '../../schemas/TrackSchema'
import { TrackServices } from '../../services/TrackServices'
import { logger } from '../../utils/logging'

const baseDir = path.normalize(path.resolve(__dirname, '..', '..', '..'))
const storageDir = `${baseDir}/storage`

class TrackController extends Controller {
    public router: Router

    public constructor() {
        super()

        this.router = Router()
        this.routes()
    }

    public routes() {
        this.router.get(
            '/',
            [...validationRules.getTrack],
            validationFunc,
            this.getTrack
        )
        this.router.post(
            '/',
            [...validationRules.uploadTrack],
            validationFunc,
            this.uploadTrack
        )
    }

    private getTrack = async (req: Request, res: Response): Promise<any> => {
        const trackId = this.escapeString(req.params.id)

        const [track, trackErr]: [any, any] = await promisify(
            TrackServices.findOne('id', trackId)
        )
        if (trackErr) {
            logger(req.ip, trackErr, 500)

            return res
                .status(500)
                .json(httpMessages.code500({}, trackErr.message))
        }

        if (!track) {
            return res
                .status(404)
                .json({ status: 404, message: '404 Not found' })
        }

        const { name, ext } = track
        const file = `${storageDir}/${trackId}/${name}.${ext}`
        console.log(file)

        fs.exists(file, exists => {
            if (exists) {
                const rstream = fs.createReadStream(file)
                rstream
                    .pipe(res)
                    .on('data', () => console.log('Sending data'))
                    .on('finish', () => console.log('Done sending data'))
            } else {
                res.status(404).json(httpMessages.code404())
                return res.end()
            }
        })
    }

    private uploadTrack = async (req: Request, res: Response): Promise<any> => {
        const filteredData = pick(req.body, TrackSchema)
        const data = {}
        for (const key in filteredData) {
            if (filteredData.hasOwnProperty(key)) {
                data[key] = this.escapeString(filteredData[key]).trim()
            }
        }

        const [newTrackId, newTrackIdErr] = await promisify(
            TrackServices.upload(data)
        )
        if (newTrackIdErr) {
            logger(req.ip, newTrackIdErr, 500)

            return res
                .status(500)
                .json(httpMessages.code500({}, newTrackIdErr.message))
        }

        const [foundTrack, foundTrackErr] = await promisify(
            TrackServices.findOne('id', newTrackId)
        )
        if (foundTrackErr) {
            logger(req.ip, foundTrackErr, 500)

            return res
                .status(500)
                .json(httpMessages.code500({}, foundTrackErr.message))
        }

        res.status(201).json(httpMessages.code200(foundTrack, 'Success'))
    }
}

export default new TrackController().router
