import {
    EventSubscriber,
    EntitySubscriberInterface,
    InsertEvent,
    UpdateEvent,
    RemoveEvent,
} from 'typeorm'
import { validate } from 'class-validator'

import { Track } from '../../entities'

@EventSubscriber()
export class TrackSubscriber implements EntitySubscriberInterface<Track> {
    public async beforeInsert(event: InsertEvent<Track>) {
        await validateData(event.entity)
    }

    public beforeUpdate(event: UpdateEvent<Track>) {
        console.log(`BEFORE ENTITY UPDATED: `, event.entity)
    }

    public beforeRemove(event: RemoveEvent<Track>) {
        console.log(
            `BEFORE ENTITY WITH ID ${event.entityId} REMOVED: `,
            event.entity
        )
    }

    public afterInsert(event: InsertEvent<Track>) {
        console.log(`AFTER ENTITY INSERTED: `, event.entity)
    }

    public afterUpdate(event: UpdateEvent<Track>) {
        console.log(`AFTER ENTITY UPDATED: `, event.entity)
    }

    public afterRemove(event: RemoveEvent<Track>) {
        console.log(
            `AFTER ENTITY WITH ID ${event.entityId} REMOVED: `,
            event.entity
        )
    }

    public afterLoad(entity: Track) {
        console.log(`AFTER ENTITY LOADED: `, entity)
    }
}

async function validateData(data: Partial<Track>) {
    try {
        const errors = await validate(data)
        if (errors.length > 0) {
            throw new TypeError(errors.toString())
        }
    } catch (err) {
        throw new Error(err.toString())
    }
}
