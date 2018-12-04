import { User } from '../../models'
import { filteredModel } from '../../models/helpers'
import { logger } from '../../lib/utils/logging'
import { isEmpty, promisify } from '../../lib/utils'
import { getManager } from 'typeorm'

/**
 * Find one user in mongodb by key, value
 *
 * return {object} user
 */
type FindOneType = (
    key: string,
    value: string | number,
    filter?: boolean,
    fields?: string[]
) => Promise<object>
export const findOne: FindOneType = async (
    key,
    value,
    filter = true,
    fields = []
) => {
    const manager = getManager()

    const [user, userErr] = await promisify(
        manager.findOne(User, { [key]: value })
    )
    if (userErr) {
        logger('Find One User Service', userErr, 500)

        return Promise.reject({ code: 500, message: userErr.message })
    }

    if (!user || isEmpty(user)) {
        return Promise.reject({ code: 404, message: 'User not found' })
    }

    if (filter) {
        return Promise.resolve(filteredModel(user, fields))
    }

    return Promise.resolve(user)
}
