import * as chai from 'chai'
import * as request from 'supertest'
import * as mongoose from 'mongoose'
import * as chaiPromises from 'chai-as-promised'

import { server } from './setup'

chai.use(chaiPromises)
const expect = chai.expect

beforeEach(async () => {
    await mongoose.connection.dropDatabase()
})

after(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.connection.close()
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
