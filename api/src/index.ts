import 'dotenv/config'
import 'reflect-metadata'
import * as http from 'http'
import * as debug from 'debug'

import server from './server'
import bootstrap from './bootstrap'
import { logger } from './lib/utils/logging'
import database from './database'

debug('express:server')

bootstrap.init().then(() => console.log('Bootstrap done.'))

const port = normalizePort(process.env.PORT || 8080)

server.set('port', port)

const httpServer = http.createServer(server)
httpServer.listen(port)
httpServer.on('error', onError)
httpServer.on('listening', onListening)

console.log(`Server Listening on port ${port}`)

export function normalizePort(
    value: number | string
): number | string | boolean {
    const iPort = typeof value === 'string' ? Number(value) : value
    switch (true) {
        case isNaN(iPort):
            return value
        case iPort >= 0:
            return iPort
        default:
            return false
    }
}

process.on(
    'uncaughtException',
    (exception: NodeJS.ErrnoException): void => {
        logger('uncaughtException in index', exception, 500)
        console.error('uncaughtException: ', exception)
        closeDBConnection()
        closeServer()

        process.exit(1)
    }
)

process.on(
    'unhandledRejection',
    (reason: any, promise: any): void => {
        logger('unhandledRejection in index', { reason, promise }, 500)
        console.error('unhandledRejection: ', promise, ' reason: ', reason)
        closeDBConnection()
        closeServer()

        process.exit(1)
    }
)

// Clean up on nodemon restarts
process.once('SIGUSR2', () => {
    closeDBConnection()
    process.kill(process.pid, 'SIGUSR2')
})

process.on('SIGINT', () => {
    closeDBConnection()
    closeServer()
    process.exit(0)
})

process.on('SIGTERM', () => {
    closeDBConnection()
    closeServer()
    process.exit(0)
})

export function onError(error: NodeJS.ErrnoException): void {
    logger('Error in index', error, 500)
    console.error('Error in Index: ', error)

    if (error.syscall !== 'listen') {
        throw error
    }
    const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`
    switch (error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`)
            closeDBConnection()
            closeServer()
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`)
            closeDBConnection()
            closeServer()
            process.exit(1)
            break
        default:
            throw error
    }
}

export function onListening(): void {
    const addr = httpServer.address()
    const bind = typeof addr === 'string' ? `Pipe ${addr}` : `Port ${addr.port}`
    debug(`Listening on ${bind}`)
}

function closeDBConnection() {
    database.closeConnection().then(() => console.log('DB connection closed.'))
}

function closeServer() {
    httpServer.close()
}

export { httpServer }
