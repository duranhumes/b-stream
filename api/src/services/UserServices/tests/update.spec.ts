import * as chai from 'chai'
import * as chaiPromises from 'chai-as-promised'
import * as faker from 'faker'

import { create } from '../create'
import { update } from '../update'
import { findOne } from '../findOne'
import { promisify } from '../../../lib/utils'

chai.use(chaiPromises)
const expect = chai.expect

describe.only('=> Update user service <=', () => {
    it('=> should update user to db', async () => {
        const [userId, userIdErr]: [any, any] = await promisify(
            create({
                userName: faker.internet.userName(),
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: faker.internet.email(),
                password: 'My_passwd@12',
            })
        )
        expect(userIdErr).to.equal(undefined)

        const newEmail = 'my-new-email@gmail.com'
        const newUserName = 'my-new-username'

        const user: any = await findOne('id', userId)

        user!.email = newEmail
        user!.userName = newUserName

        const [updateUser, updateUserErr]: [any, any] = await promisify(
            update(user, { userName: newUserName, email: newEmail })
        )
        expect(updateUserErr).to.equal(undefined)
        console.log({ updateUser, updateUserErr })
        expect(updateUser!.email).to.equal(newEmail)
        expect(updateUser!.userName).to.equal(newUserName)
    })
})
