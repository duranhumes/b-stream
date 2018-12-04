import { getManager } from 'typeorm'

import { logger } from '../../lib/utils/logging'
import { promisify } from '../../lib/utils'
import { User } from '../../models/User'

/**
 * Remove one user in db by id
 *
 * @param {mongoose model} user - instance to be deleted.
 *
 * @returns {string}
 */
type RemoveType = (userId: string) => Promise<any>
export const remove: RemoveType = async userId => {
    const manager = getManager()

    const [, removeUserErr] = await promisify(manager.delete(User, userId))
    if (removeUserErr) {
        logger('Remove User Service', removeUserErr, 500)

        return Promise.reject({ code: 500, message: removeUserErr.message })
    }

    return Promise.resolve(null)
}
