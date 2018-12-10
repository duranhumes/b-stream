import {
    EventSubscriber,
    EntitySubscriberInterface,
    InsertEvent,
    UpdateEvent,
    RemoveEvent,
} from 'typeorm'
import { validate } from 'class-validator'

import { Genre } from '../../entities'

@EventSubscriber()
export class GenreSubscriber implements EntitySubscriberInterface<Genre> {
    async beforeInsert(event: InsertEvent<Genre>) {
        await validateData(event.entity)
    }

    async beforeUpdate(event: UpdateEvent<Genre>) {
        await validateData(event.entity)
    }

    beforeRemove(event: RemoveEvent<Genre>) {
        console.log(
            `BEFORE ENTITY WITH ID ${event.entityId} REMOVED: `,
            event.entity
        )
    }

    afterInsert(event: InsertEvent<Genre>) {
        console.log(`AFTER ENTITY INSERTED: `, event.entity)
    }

    afterUpdate(event: UpdateEvent<Genre>) {
        console.log(`AFTER ENTITY UPDATED: `, event.entity)
    }

    afterRemove(event: RemoveEvent<Genre>) {
        console.log(
            `AFTER ENTITY WITH ID ${event.entityId} REMOVED: `,
            event.entity
        )
    }

    afterLoad(entity: Genre) {
        console.log(`AFTER ENTITY LOADED: `, entity)
    }
}

async function validateData(data: Partial<Genre>) {
    try {
        const errors = await validate(data, { skipMissingProperties: true })
        if (errors.length > 0) {
            throw new TypeError(errors.toString())
        }
    } catch (err) {
        throw new Error(err.toString())
    }
}
