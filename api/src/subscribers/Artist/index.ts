import {
    EventSubscriber,
    EntitySubscriberInterface,
    InsertEvent,
    UpdateEvent,
    RemoveEvent,
} from 'typeorm'
import { validate } from 'class-validator'

import { Artist } from '../../entities'

@EventSubscriber()
export class ArtistSubscriber implements EntitySubscriberInterface<Artist> {
    async beforeInsert(event: InsertEvent<Artist>) {
        await validateData(event.entity)
    }

    async beforeUpdate(event: UpdateEvent<Artist>) {
        await validateData(event.entity)
    }

    beforeRemove(event: RemoveEvent<Artist>) {
        console.log(
            `BEFORE ENTITY WITH ID ${event.entityId} REMOVED: `,
            event.entity
        )
    }

    afterInsert(event: InsertEvent<Artist>) {
        console.log(`AFTER ENTITY INSERTED: `, event.entity)
    }

    afterUpdate(event: UpdateEvent<Artist>) {
        console.log(`AFTER ENTITY UPDATED: `, event.entity)
    }

    afterRemove(event: RemoveEvent<Artist>) {
        console.log(
            `AFTER ENTITY WITH ID ${event.entityId} REMOVED: `,
            event.entity
        )
    }

    afterLoad(entity: Artist) {
        console.log(`AFTER ENTITY LOADED: `, entity)
    }
}

async function validateData(data: Partial<Artist>) {
    try {
        const errors = await validate(data, { skipMissingProperties: true })
        if (errors.length > 0) {
            throw new TypeError(errors.toString())
        }
    } catch (err) {
        throw new Error(err.toString())
    }
}
