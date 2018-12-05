import * as chai from 'chai'
import * as request from 'supertest'
import * as chaiPromises from 'chai-as-promised'

import { server } from './setup'
import database from '../database'

chai.use(chaiPromises)
const expect = chai.expect

beforeEach(async () => {
    if (!database.isConnected) {
        await database.openConnection()
    }
    await database.clearTables()
})

after(async () => {
    await database.clearTables()
    await database.closeConnection()
    server.close()
    console.log('=> Connections closed')
})

describe('=> API base route <=', () => {
    it('=> should serve /v1 without crashing', async () => {
        const response = await request(server)
            .get('/v1')
            .set('Content-Type', 'application/json')

        expect(response.status).to.equal(404)
    })
})
