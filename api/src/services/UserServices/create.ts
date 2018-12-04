import { getManager } from 'typeorm'

import { User } from '../../models'
import { logger } from '../../lib/utils/logging'
import { isEmpty, promisify } from '../../lib/utils'

/**
 * Create a new mongodb user record.
 *
 * @returns {object} new user id
 */
type CreateType = (user: object) => Promise<object | null>
export const create: CreateType = async data => {
    const manager = getManager()

    const tempUser = new User()
    Object.assign(tempUser, data)

    const [newUser, newUserErr]: [any, any] = await promisify(
        manager.insert(User, tempUser)
    )
    if (newUserErr) {
        console.log({ newUserErr })
        if (newUserErr.code === 'ER_DUP_ENTRY') {
            return Promise.reject({ code: 409, message: newUserErr.message })
        }

        logger('Create User Service', newUserErr, 500)

        return Promise.reject({ code: 500, message: newUserErr.message })
    }

    if (!newUser || isEmpty(newUser)) {
        return Promise.resolve(null)
    }

    return Promise.resolve(newUser.identifiers[0].id)
}
