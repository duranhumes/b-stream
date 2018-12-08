import * as chai from 'chai'
import * as chaiPromises from 'chai-as-promised'
import * as faker from 'faker'

import { create } from '../create'
import { update } from '../update'
import { findOne } from '../findOne'
import { promisify } from '../../../utils'

chai.use(chaiPromises)
const expect = chai.expect

describe('=> Update user service <=', () => {
    it('=> should update user to db', async () => {
        const [userId, userIdErr]: [any, any] = await promisify(
            create({
                userName: faker.internet.userName(),
                email: 'emailzzz@email.com',
                password: 'My_passwd@!123',
            })
        )
        expect(userIdErr).to.equal(undefined)

        const newEmail = 'myEmail@gmail.com'
        const newUserName = 'my-new-username'

        const user: any = await findOne('id', userId, false)

        user!.email = newEmail
        user!.userName = newUserName

        const [updateUser, updateUserErr]: [any, any] = await promisify(
            update(user, { userName: newUserName, email: newEmail })
        )

        expect(updateUserErr).to.equal(undefined)
        expect(updateUser!.email).to.equal(newEmail.toLowerCase())
        expect(updateUser!.userName).to.equal(
            newUserName.replace(/\s+/g, '-').toLowerCase()
        )
    })
})
