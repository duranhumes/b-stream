import * as chai from 'chai'
import * as chaiPromises from 'chai-as-promised'
import * as faker from 'faker'

import { create } from '../create'
import { findOne } from '../findOne'
import { remove } from '../remove'
import { promisify } from '../../../lib/utils'

chai.use(chaiPromises)
const expect = chai.expect

describe('=> Remove user service <=', () => {
    it('=> should remove a user by the given mongoose user obj', async () => {
        const [user, userErr]: [any, any] = await promisify(
            create(
                {
                    userName: faker.internet.userName(),
                    firstName: faker.name.firstName(),
                    lastName: faker.name.lastName(),
                    email: faker.internet.email(),
                    password: 'My_passwd@12',
                },
                false
            )
        )
        expect(userErr).to.equal(undefined)

        const [removeUser, removeUserErr] = await promisify(remove(user))
        expect(removeUserErr).to.equal(undefined)
        expect(removeUser).to.equal(null)

        const [userToBeDeleted, userToBeDeletedErr] = await promisify(
            findOne('id', user.id)
        )
        expect(userToBeDeleted).to.equal(undefined)
        expect(userToBeDeletedErr!.code).to.equal(404)
        expect(userToBeDeletedErr!.message.toString()).to.equal(
            'User not found'
        )
    })
    it('=> should throw err if obj provided is not a mongoose model', async () => {
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

        const [removeUser, removeUserErr] = await promisify(remove(user))
        expect(removeUser).to.equal(undefined)
        expect(
            String(removeUserErr).includes('user.remove is not a function')
        ).to.equal(true)
    })
})
