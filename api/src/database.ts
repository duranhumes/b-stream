import * as fs from 'fs'
import * as path from 'path'
import { createConnection, ConnectionOptions, Connection } from 'typeorm'
import { logger } from './lib/utils/logging'

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
            entities: ['src/models/*.ts'],
            subscribers: ['src/subscribers/*.ts'],
            migrations: ['src/migrations/*.ts'],
            host: String(process.env.MYSQL_HOST),
            port: Number(process.env.MYSQL_PORT),
            username: String(process.env.MYSQL_ROOT_USER),
            password: String(process.env.MYSQL_PASSWORD),
            logging: !isProduction,
            synchronize: true,
        }
        this.connection = new Connection(this.connectionOptions)
    }

    public async init() {
        await this.openConnection()
        this.genModelSchemas()

        console.log('DB successfully connected')
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

    /**
     * Loop through all models and gen schemas
     * to validate against later
     */
    private genModelSchemas() {
        const modelsDir = `${projectDirBasePath}/src/models`
        const schemasDir = `${projectDirBasePath}/src/schemas`

        let files: string[] = []
        try {
            files = fs.readdirSync(modelsDir)
        } catch (err) {
            console.log(err)

            process.exit(0)
        }

        /**
         * Filter out folders and files with
         * only first letter being capital
         * and with name not being 'Model'
         */
        const models = files.filter((file: string) => {
            const firstLetter = file.charAt(0)

            return firstLetter === firstLetter.toUpperCase() && file !== 'Model'
        })

        /**
         * Loop through files found and use
         * typeorm connection to get schema data
         * and write to file in schemas folder
         */
        if (models.length > 0) {
            models.forEach((model: string) => {
                const modelSchema = this.connection.getMetadata(model)
                    .propertiesMap

                const keys = (Object.keys(modelSchema) as any).map(
                    (k: any) => `'${k}'`
                )
                const template = `export default [${keys}]`

                const schemaFile = `${schemasDir}/${model}Schema.ts`
                try {
                    fs.writeFileSync(schemaFile, template)

                    console.log(`${model} schema created!`)
                } catch (err) {
                    console.log(err)

                    process.exit(0)
                }
            })
        }
    }
}

export default new Database()
