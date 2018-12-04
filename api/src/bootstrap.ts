import * as fs from 'fs'
import * as path from 'path'

import database from './database'

const projectDirBasePath = path.normalize(path.resolve(__dirname, '..'))

class Bootstrap {
    public async init() {
        this.createStorageDir()
        this.createLogsDir()

        fs.closeSync(0)

        await database.init()
    }

    private createStorageDir() {
        const storageDir = `${projectDirBasePath}/storage`
        if (!fs.existsSync(storageDir)) {
            fs.mkdirSync(storageDir)
        }
    }

    private createLogsDir() {
        const logsDir = `${projectDirBasePath}/logs`
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir)
        }
    }
}

export default new Bootstrap()
