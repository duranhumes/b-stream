import * as path from 'path'
import * as shell from 'shelljs'

import { TrackData } from './createTempTrack'

const baseDir = path.normalize(path.resolve(__dirname, '..', '..', '..'))
const tempDir = `${baseDir}/temp`
const storageDir = `${baseDir}/storage`

export const createPermTrack = async (trackData: TrackData) => {
    if (!shell.which('ffmpeg')) {
        shell.echo('Sorry, this script requires ffmpeg')

        shell.exit(1)
        process.exit(1)
    }

    const { fileName, fileExt } = trackData
    const tempTrackFile = `${tempDir}/${fileName}.${fileExt}`
    const tempTrackFileConverted = `${tempDir}/${fileName}-converted.${fileExt}`
    const destTrackFile = `${storageDir}/${fileName}.${fileExt}`
    const command = `./ffmpeg.sh ${tempDir}/${fileName} ${fileExt}`
    try {
        shell.cd(baseDir)
        await shell.exec(command, { async: true, silent: false }, () => {
            shell.exec('sleep 2;')
            shell.mv(tempTrackFileConverted, destTrackFile)
            shell.rm([tempTrackFile])
        })
    } catch (err) {
        throw new Error(err.toString())
    }

    return Promise.resolve(destTrackFile)
}
