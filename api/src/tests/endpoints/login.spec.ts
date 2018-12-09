import * as chai from 'chai'
import * as request from 'supertest'
import * as chaiPromises from 'chai-as-promised'
import * as faker from 'faker'

import { UserServices } from '../../services/UserServices'
import { promisify } from '../../utils'
import { server } from '../setup'

const genUserData = () => ({
    userName: `${faker.internet.userName()}w`,
    email: 'myEmail@gmail.com',
    password: 'My_passwd@!12',
})

chai.use(chaiPromises)
const expect = chai.expect

describe('=> API Login Endpoint <=', () => {
    it('=> basicLogin should return user obj along with and cookie header after login', async () => {
        const userObj = genUserData()
        await promisify(UserServices.create(userObj))

        const { email, password } = userObj
        const response = await request(server)
            .post('/v1/login')
            .set('Content-Type', 'application/json')
            .send({ email, password })

        expect(response.body.response).to.haveOwnProperty('id')
        expect(response.body.response).to.haveOwnProperty('email')
        expect(response.body.response).to.not.haveOwnProperty('password')
        expect(response.header['set-cookie'].length).to.equal(1)
        expect(response.status).to.equal(200)
    })
    it('=> basicLogin should return 401 for invalid credentials & 404 for user not found', async () => {
        const userObj = genUserData()
        await promisify(UserServices.create(userObj))

        const { email, password } = userObj
        const response = await request(server)
            .post('/v1/login')
            .set('Content-Type', 'application/json')
            .send({ password, email: `dsani${email}` })

        expect(response.status).to.equal(404)

        const response2 = await request(server)
            .post('/v1/login')
            .set('Content-Type', 'application/json')
            .send({ email, password: `${password}dsa` })

        expect(response2.status).to.equal(401)
    })
})
