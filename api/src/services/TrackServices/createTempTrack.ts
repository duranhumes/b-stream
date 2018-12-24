import * as fs from 'fs'
import * as path from 'path'
import * as uuid from 'uuid/v4'
import { Readable } from 'stream'

const baseDir = path.normalize(path.resolve(__dirname, '..', '..', '..'))
const tempDir = `${baseDir}/temp`

export interface TempTrackData {
    data: Buffer
    name: string
    encoding: string
    mimetype: string
    truncated: boolean
    size: number
}

export interface TrackData {
    fileName: string
    fileExt: string
    fileSize: number
}

export const createTempTrack = async (
    tempTrackData: TempTrackData
): Promise<any> => {
    const trackName = uuid().replace(/[^a-z0-9]/gi, '')
    const trackExt = tempTrackData.mimetype.split('/')[1]
    const tempTrackFile = `${tempDir}/${trackName}.${trackExt}`

    const trackData: TrackData = {
        fileName: trackName,
        fileExt: trackExt,
        fileSize: tempTrackData.size,
    }

    const stream = fs.createWriteStream(tempTrackFile)
    const readable = new Readable()
    readable.push(tempTrackData.data)
    readable.push(null)
    readable
        .pipe(stream)
        .on('data', (data: any) => console.log('Creating', data))
        .on('error', (error: any) => {
            console.error(error)
            stream.end()
            readable.destroy()

            return Promise.reject(error)
        })
        .on('finish', () => {
            stream.end()
            readable.destroy()
        })
        .on('close', () => {
            stream.destroy()
            readable.destroy()
        })

    fs.exists(tempTrackFile, exists => {
        if (!exists) {
            Promise.reject({
                code: 404,
                message: `${trackData.fileName}.${
                    trackData.fileExt
                } does not exist`,
            })
        }
    })

    return Promise.resolve(trackData)
}
