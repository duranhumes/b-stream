import * as chai from 'chai'
import * as chaiPromises from 'chai-as-promised'
import * as faker from 'faker'

import { create } from '../create'
import { promisify } from '../../../lib/utils'

chai.use(chaiPromises)
const expect = chai.expect

describe('=> Create user service <=', () => {
    it('=> should handle case when user already exists and reject it', async () => {
        const user = {
            userName: `${faker.internet.userName()}nda9`,
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: `sdani${faker.internet.email()}`,
            password: 'My_passwd@12',
        }

        await promisify(create(user))

        const [, dupUserErr] = await promisify(create(user))
        const mongooseDuplicateErrorCode = 'E11000'
        expect(dupUserErr).to.equal(true)
        expect(
            dupUserErr!.message.startsWith(mongooseDuplicateErrorCode)
        ).to.equal(true)
    })
})
