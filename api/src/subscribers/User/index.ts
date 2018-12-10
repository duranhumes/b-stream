import {
    EventSubscriber,
    EntitySubscriberInterface,
    InsertEvent,
    UpdateEvent,
    RemoveEvent,
} from 'typeorm'
import { validate } from 'class-validator'

import {
    User,
    passwordValidationMessage,
    passwordRegex,
} from '../../entities/User'
import { hashPassword } from '../../auth/password'

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    async beforeInsert(event: InsertEvent<User>) {
        await validateData(event.entity)
        if (
            event.entity.userName &&
            event.entity.email &&
            event.entity.password
        ) {
            event.entity.userName = event.entity.userName
                .replace(/\s+/g, '-')
                .toLowerCase()
            event.entity.email = event.entity.email.toLowerCase()
            if (
                event.entity.password !==
                String(process.env.DEFAULT_OAUTH_PASSWORD)
            ) {
                if (validatePassword(event.entity.password)) {
                    const hashedPassword = await hashPassword(
                        event.entity.password
                    )
                    if (hashedPassword) {
                        event.entity.password = hashedPassword
                    } else {
                        throw new Error('In password hash.')
                    }
                } else {
                    throw new TypeError(passwordValidationMessage)
                }
            }
        }
    }

    async beforeUpdate(event: UpdateEvent<User>) {
        if (
            event.entity.password &&
            event.entity.password.startsWith('$argon2id')
        ) {
            const currentData = {}
            Object.assign(currentData, event.entity, { password: null })
            await validateData(currentData)
        } else {
            await validateData(event.entity)
        }

        if (event.entity.email) {
            event.entity.email = event.entity.email.toLowerCase()
        }
        if (event.entity.userName) {
            event.entity.userName = event.entity.userName
                .replace(/\s+/g, '-')
                .toLowerCase()
        }

        // Skip password validation if password is already hashed and hasn't changed or is empty
        if (
            event.entity.password &&
            !event.entity.password.startsWith('$argon2id')
        ) {
            if (validatePassword(event.entity.password)) {
                const hashedPassword = await hashPassword(event.entity.password)
                if (hashedPassword) {
                    event.entity.password = hashedPassword
                } else {
                    throw new Error('In password hash.')
                }
            } else {
                throw new TypeError(passwordValidationMessage)
            }
        }
    }

    beforeRemove(event: RemoveEvent<User>) {
        console.log(
            `BEFORE ENTITY WITH ID ${event.entityId} REMOVED: `,
            event.entity
        )
    }

    afterInsert(event: InsertEvent<User>) {
        console.log(`AFTER ENTITY INSERTED: `, event.entity)
    }

    afterUpdate(event: UpdateEvent<User>) {
        console.log(`AFTER ENTITY UPDATED: `, event.entity)
    }

    afterRemove(event: RemoveEvent<User>) {
        console.log(
            `AFTER ENTITY WITH ID ${event.entityId} REMOVED: `,
            event.entity
        )
    }

    afterLoad(entity: User) {
        console.log(`AFTER ENTITY LOADED: `, entity)
    }
}

async function validateData(data: Partial<User>) {
    try {
        const errors = await validate(data, { skipMissingProperties: true })
        if (errors.length > 0) {
            throw new TypeError(errors.toString())
        }
    } catch (err) {
        throw new Error(err.toString())
    }
}

function validatePassword(password: string) {
    return passwordRegex.test(password)
}
