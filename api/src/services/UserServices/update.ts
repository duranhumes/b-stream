import { getManager } from 'typeorm'

import { filteredModel } from '../../models/helpers'
import { logger } from '../../lib/utils/logging'
import { promisify } from '../../lib/utils'
import { User } from '../../models/User'

/**
 * Update user in mongodb
 *
 * @returns {object} updated user
 */
type UpdateType = (
    user: User,
    data: Partial<User>,
    filter?: boolean,
    fields?: string[]
) => Promise<object | null>
export const update: UpdateType = async (
    user,
    data,
    filter = true,
    fields = []
) => {
    // const manager = getManager()
    // const userRepository = manager.getRepository(User)

    // Object.assign(user, data)
    const manager = getManager()

    const tempUser = new User()
    Object.assign(tempUser, user, {
        ...data,
    })

    const [updatedUser, updatedUserErr]: [any, any] = await promisify(
        manager.save(User, tempUser)
    )
    // const [updatedUser, updatedUserErr] = await promisify(
    //     userRepository.save(user)
    // )
    if (updatedUserErr) {
        logger('Update User Service', updatedUserErr, 500)

        return Promise.reject({ code: 500, message: updatedUserErr.message })
    }

    if (!updatedUser) {
        return Promise.resolve(null)
    }

    if (filter) {
        return Promise.resolve(filteredModel(updatedUser, fields))
    }

    return Promise.resolve(updatedUser)
}
