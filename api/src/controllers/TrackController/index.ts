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
import { allowedTrackFileExt } from '../../entities/Track'

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
        this.router.post('/', this.uploadTrack)
    }

    private getTrack = async (req: Request, res: Response): Promise<any> => {
        const trackId = this.escapeString(req.params.id).trim()

        const [track, trackErr] = await promisify(
            TrackServices.findOne('id', trackId)
        )
        if (trackErr) {
            logger(req.ip, trackErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        if (!track) {
            return res.status(404).json(httpMessages.code404())
        }

        const { fileName, fileExt } = track
        const file = `${storageDir}/${fileName}.${fileExt}`
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

    private uploadTrack = async (req: any, res: Response): Promise<any> => {
        if (!req.files) {
            return res.status(406).json({
                status: 406,
                error: 'No file provided',
                message: 'A file must be provided for this endpoint',
            })
        }

        const filteredData = pick(req.body, TrackSchema)
        const textFields = {}
        for (const key in filteredData) {
            if (filteredData.hasOwnProperty(key)) {
                textFields[key] = this.escapeString(filteredData[key]).trim()
            }
        }

        const tempTrackData = req.files.file
        const mimeTypeMatches = allowedTrackFileExt.filter(s =>
            `audio/${tempTrackData.mimetype}`.includes(s)
        )
        if (!tempTrackData.mimetype || mimeTypeMatches.length === 0) {
            return res.status(406).json({
                status: 406,
                error: 'Unsupported file type',
                message: `The file type ${
                    tempTrackData.mimetype
                } is not supported`,
            })
        }

        const [tempTrack, tempTrackErr] = await promisify(
            TrackServices.createTempTrack(tempTrackData)
        )
        if (tempTrackErr) {
            logger(req.ip, tempTrackErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        const [permTrack, permTrackErr] = await promisify(
            TrackServices.createPermTrack(tempTrack)
        )
        if (permTrackErr) {
            logger(req.ip, permTrackErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        const trackData = {
            ...textFields,
            ...tempTrack,
        }

        console.log(permTrack)
        console.log(trackData)
        return res.sendStatus(201)

        const [newTrackId, newTrackIdErr] = await promisify(
            TrackServices.create(trackData)
        )
        if (newTrackIdErr) {
            logger(req.ip, newTrackIdErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        const [foundTrack, foundTrackErr] = await promisify(
            TrackServices.findOne('id', newTrackId)
        )
        if (foundTrackErr) {
            logger(req.ip, foundTrackErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        res.status(201).json(httpMessages.code201(foundTrack))
    }
}

export default new TrackController().router
