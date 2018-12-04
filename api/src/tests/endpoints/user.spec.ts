import * as chai from 'chai'
import * as request from 'supertest'
import * as chaiPromises from 'chai-as-promised'
import * as faker from 'faker'

import { server } from '../setup'

chai.use(chaiPromises)
const expect = chai.expect

const genUserData = () => ({
    userName: `${faker.internet.userName()}w`,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: `w${faker.internet.email()}`,
    password: 'My_passwd@12',
})

describe('=> API User Endpoint <=', () => {
    describe('=> me <=', () => {
        let userObj: any = {}
        let authToken: any = null
        beforeEach(async () => {
            userObj = genUserData()
            const response = await request(server)
                .post('/v1/users')
                .set('Content-Type', 'application/json')
                .send(userObj)

            authToken = response.header.authorization
        })
        it('=> should return the current authenticated user data', async () => {
            const response = await request(server)
                .get('/v1/users/me')
                .set('Content-Type', 'application/json')
                .set('authorization', authToken)

            expect(response.body.response).to.haveOwnProperty('id')
            expect(response.body.response).to.haveOwnProperty('email')
            expect(response.body.response).to.not.haveOwnProperty('password')
            expect(response.status).to.equal(200)
        })
        it('=> should return 401 if not authenticated', async () => {
            const response = await request(server)
                .get('/v1/users/me')
                .set('Content-Type', 'application/json')

            expect(response.status).to.equal(401)
        })
    })
    describe('=> createUser <=', () => {
        it('=> should return a new user if valid data is passed', async () => {
            const newUserObj = genUserData()

            const response = await request(server)
                .post('/v1/users')
                .set('Content-Type', 'application/json')
                .send(newUserObj)

            expect(response.body.response).to.haveOwnProperty('id')
            expect(response.body.response).to.haveOwnProperty('email')
            expect(response.body.response).to.not.haveOwnProperty('password')
            expect(response.status).to.equal(201)
        })
        it('=> should return an error if data is bad', async () => {
            const newUserObj = genUserData()
            newUserObj.password = 'passwd'

            const response = await request(server)
                .post('/v1/users')
                .set('Content-Type', 'application/json')
                .send(newUserObj)

            expect(response.status).to.equal(422)
        })
        it('=> should return an error if required data is missing or doesnt pass validation', async () => {
            const userObj = genUserData()
            // Check password requirements validation
            const response = await request(server)
                .post('/v1/users')
                .set('Content-Type', 'application/json')
                .send({ ...userObj, password: 'password' })

            expect(response.status).to.equal(422)

            delete userObj.userName
            const respons2 = await request(server)
                .post('/v1/users')
                .set('Content-Type', 'application/json')
                .send(userObj)

            expect(respons2.status).to.equal(422)
        })
    })
    describe('=> getUser <=', () => {
        let userObj: any = {}
        let userId: any = null
        beforeEach(async () => {
            userObj = genUserData()
            const response = await request(server)
                .post('/v1/users')
                .set('Content-Type', 'application/json')
                .send(userObj)

            userId = response.body.response.id
        })
        it('=> should return a user found by ID', async () => {
            const response = await request(server)
                .get(`/v1/users/${userId}`)
                .set('Content-Type', 'application/json')

            expect(response.body.response).to.haveOwnProperty('id')
            expect(response.body.response).to.haveOwnProperty('email')
            expect(response.body.response).to.not.haveOwnProperty('password')
            expect(response.status).to.equal(200)
        })
        it('=> should return 404 if not found', async () => {
            const response = await request(server)
                .get('/v1/users/some-id-that-doesnt-exist')
                .set('Content-Type', 'application/json')

            expect(response.status).to.equal(404)
        })
    })
    describe('=> getUsers <=', () => {
        let userObj: any = {}
        beforeEach(async () => {
            userObj = genUserData()
        })
        it('=> should return an empty array if there are no users', async () => {
            const response = await request(server)
                .get('/v1/users')
                .set('Content-Type', 'application/json')

            expect(response.body.response).to.eql([])
        })
        it('=> should return an array of users', async () => {
            await request(server)
                .post('/v1/users')
                .set('Content-Type', 'application/json')
                .send(userObj)

            const newUserObj = {
                ...userObj,
                userName: `${userObj.userName}2n`,
                email: `sda90${userObj.email}`,
            }
            await request(server)
                .post('/v1/users')
                .set('Content-Type', 'application/json')
                .send(newUserObj)

            const response = await request(server)
                .get('/v1/users')
                .set('Content-Type', 'application/json')

            expect(response.body.response[0]).to.haveOwnProperty('id')
            expect(response.body.response[0]).to.haveOwnProperty('email')
            expect(response.body.response[0]).to.not.haveOwnProperty('password')
            expect(response.body.response.length).to.equal(2)
            expect(response.status).to.equal(200)
        })
    })
    describe('=> updateUser <=', () => {
        let userObj: any = {}
        let authToken: any = null
        let userId: any = null
        beforeEach(async () => {
            userObj = genUserData()
            const response = await request(server)
                .post('/v1/users')
                .set('Content-Type', 'application/json')
                .send(userObj)

            authToken = response.header.authorization
            userId = response.body.response.id
        })
        it('=> should update the user found by the given id with new data from body', async () => {
            const originalUserObj = { ...userObj }

            const newEmail = 'my-email@gmail.com'
            const newUserName = 'my-new-user-name'

            userObj.email = newEmail
            userObj.userName = newUserName

            const response = await request(server)
                .patch(`/v1/users/${userId}`)
                .set('Content-Type', 'application/json')
                .set('authorization', authToken)
                .send(userObj)

            expect(response.body.response).to.haveOwnProperty('id')
            expect(response.body.response).to.haveOwnProperty('email')
            expect(response.body.response).to.not.haveOwnProperty('password')
            expect(response.body.response.email).to.equal(newEmail)
            expect(response.body.response.email).to.not.equal(
                originalUserObj.email
            )
            expect(response.body.response.userName).to.equal(newUserName)
            expect(response.body.response.userName).to.not.equal(
                originalUserObj.userName
            )
            expect(response.status).to.equal(200)
        })
        it('should return 403 if authenticated user id and request id dont match', async () => {
            const response = await request(server)
                .patch(`/v1/users/${userId}20`)
                .set('Content-Type', 'application/json')
                .set('authorization', authToken)
                .send(userObj)

            expect(response.status).to.equal(403)
        })
    })
    describe('=> deleteUser <=', () => {
        let userObj: any = {}
        let authToken: any = null
        let userId: any = null
        beforeEach(async () => {
            userObj = genUserData()
            const response = await request(server)
                .post('/v1/users')
                .set('Content-Type', 'application/json')
                .send(userObj)

            authToken = response.header.authorization
            userId = response.body.response.id
        })
        it('=> should delete user found by the given id', async () => {
            await request(server)
                .delete(`/v1/users/${userId}`)
                .set('Content-Type', 'application/json')
                .set('authorization', authToken)

            const response = await request(server)
                .get(`/v1/users/${userId}`)
                .set('Content-Type', 'application/json')

            expect(response.body.response).to.eql({})
            expect(response.status).to.equal(404)
        })
        it('should return 403 if authenticated user id and request id dont match', async () => {
            const response = await request(server)
                .delete(`/v1/users/${userId}20`)
                .set('Content-Type', 'application/json')
                .set('authorization', authToken)
                .send(userObj)

            expect(response.status).to.equal(403)
        })
    })
})
