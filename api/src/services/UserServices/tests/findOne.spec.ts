import * as chai from 'chai'
import * as chaiPromises from 'chai-as-promised'
import * as faker from 'faker'

import { create } from '../create'
import { findOne } from '../findOne'
import { promisify } from '../../../lib/utils'

chai.use(chaiPromises)
const expect = chai.expect

describe('=> Find one user service <=', () => {
    it('=> should return 404 if user does not exist.', async () => {
        const [user, userErr] = await promisify(
            findOne('email', 'email123-that-doesnt-exist@gmail.com')
        )

        expect(user).to.equal(undefined)
        expect(userErr!.code).to.equal(404)
        expect(userErr!.message.toString()).to.equal('User not found')
    })
    it('=> should find a user by the given key value pair', async () => {
        const [user, userErr]: [any, any] = await promisify(
            create({
                userName: faker.internet.userName(),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: faker.internet.email(),
                password: 'My_passwd@12',
            })
        )
        expect(userErr).to.equal(undefined)

        const [foundUser, foundUserErr] = await promisify(
            findOne('id', user!.id)
        )
        expect(foundUserErr).to.equal(undefined)
        expect(foundUser).to.haveOwnProperty('email')
        expect(foundUser).to.not.haveOwnProperty('password')
        expect(foundUser).to.not.haveOwnProperty('__v')

        const [foundUser2, foundUser2Err] = await promisify(
            findOne('email', user.email)
        )
        expect(foundUser2Err).to.equal(undefined)
        expect(foundUser2).to.haveOwnProperty('email')
        expect(foundUser2).to.not.haveOwnProperty('password')
        expect(foundUser2).to.not.haveOwnProperty('__v')
    })
})
