import * as fs from 'fs'
import * as path from 'path'
import { createConnection, ConnectionOptions, Connection } from 'typeorm'
import * as rimraf from 'rimraf'

import { logger } from './utils/logging'

const isProduction = process.env.NODE_ENV === 'production'
const isTesting = process.env.NODE_ENV === 'test'
const database = isTesting
    ? String(process.env.MYSQL_DATABASES_TEST)
    : String(process.env.MYSQL_DATABASES)
const projectDirBasePath = path.normalize(path.resolve(__dirname, '..'))

class Database {
    connectionOptions: ConnectionOptions
    connection: Connection

    constructor() {
        this.connectionOptions = {
            database,
            type: 'mysql',
            entities: ['src/entities/**/index.ts'],
            subscribers: ['src/subscribers/**/index.ts'],
            migrations: ['src/migrations/*.ts'],
            host: String(process.env.MYSQL_HOST),
            port: Number(process.env.MYSQL_PORT),
            username: String(process.env.MYSQL_ROOT_USER),
            password: String(process.env.MYSQL_PASSWORD),
            logging: !isProduction && !isTesting,
            synchronize: true,
        }
        this.connection = new Connection(this.connectionOptions)
    }

    public async init() {
        await this.openConnection()
        await this.genModelSchemas()

        console.log('DB successfully connected')
    }

    public get isConnected() {
        return this.connection.isConnected
    }

    public async openConnection() {
        try {
            this.connection = await createConnection(this.connectionOptions)

            await this.connection.close()
            await this.connection.connect()
        } catch (err) {
            logger('Error in db connection', err, 500)
            console.error('Error in db connection: ', err)

            process.exit(1)
        }
    }

    public async closeConnection() {
        try {
            await this.connection.close()
        } catch (err) {
            logger('Error in db connection close', err, 500)
            console.error('Error in db connection close: ', err)

            process.exit(1)
        }
    }

    public async clearTables() {
        const entities = this.connection.entityMetadatas

        for (const entity of entities) {
            const repository = await this.connection.getRepository(entity.name)
            await repository.query(`TRUNCATE TABLE ${entity.tableName};`)
        }
    }

    /**
     * Loop through all models and gen schemas
     * to validate against later
     */
    private async genModelSchemas() {
        const schemasDir = `${projectDirBasePath}/src/schemas`
        rimraf(`${schemasDir}/*`, (err: any) => {
            if (err) {
                console.error(err)

                process.exit(0)
            }

            const entities = this.connection.entityMetadatas
            for (const entity of entities) {
                const modelSchema = this.connection.getMetadata(entity.name)
                    .propertiesMap

                const objKeys = Object.keys(modelSchema)
                const keys = objKeys.map((k: any) => `\n    '${k}'`)
                const template = `export default [${keys},\n]\n`

                const fileName =
                    entity.name.charAt(0).toUpperCase() + entity.name.slice(1)
                const schemaFile = `${schemasDir}/${fileName}Schema.ts`
                try {
                    fs.writeFileSync(schemaFile, template)

                    console.log(`${entity.name} schema created!`)
                } catch (err) {
                    console.log(err)

                    process.exit(0)
                }
            }
        })
    }
}

export default new Database()
