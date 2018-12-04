import * as chai from 'chai'
import * as chaiPromises from 'chai-as-promised'
import * as faker from 'faker'

import { create } from '../create'
import { update } from '../update'
import { promisify } from '../../../lib/utils'

chai.use(chaiPromises)
const expect = chai.expect

describe('=> Update user service <=', () => {
    it('=> should update user to db', async () => {
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

        const newEmail = 'my-new-email@gmail.com'
        const newUserName = 'my-new-username'

        user!.email = newEmail
        user!.userName = newUserName

        const [updateUser, updateUserErr]: [any, any] = await promisify(
            update(user)
        )
        expect(updateUserErr).to.equal(undefined)
        expect(updateUser!.email).to.equal(newEmail)
        expect(updateUser!.userName).to.equal(newUserName)
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

        const [updateUser, updateUserErr] = await promisify(update(user))
        expect(updateUser).to.equal(undefined)
        expect(
            String(updateUserErr).includes('user.save is not a function')
        ).to.equal(true)
    })
})
