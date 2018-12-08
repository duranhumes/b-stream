import { getManager } from 'typeorm'

import { User } from '../../models'
import { filteredModel } from '../../models/helpers'
import { logger } from '../../utils/logging'
import { isEmpty, promisify } from '../../utils'

/**
 * Find all users in db
 *
 * @returns {array} users
 */
type FindAllType = (filter?: boolean, fields?: string[]) => Promise<object>
export const findAll: FindAllType = async (filter = true, fields = []) => {
    const manager = getManager()

    const [users, usersErr] = await promisify(manager.find(User, {}))
    if (usersErr) {
        logger('Find All User Service', usersErr, 500)

        return Promise.reject({ code: 500, message: usersErr.message })
    }

    if (!users || isEmpty(users)) {
        return Promise.resolve([])
    }

    if (filter) {
        return Promise.resolve(filteredModel(users, fields))
    }

    return Promise.resolve(users)
}
