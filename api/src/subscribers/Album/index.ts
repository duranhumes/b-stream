import {
    EventSubscriber,
    EntitySubscriberInterface,
    InsertEvent,
    UpdateEvent,
    RemoveEvent,
} from 'typeorm'

import { Album } from '../../entities'

@EventSubscriber()
export class AlbumSubscriber implements EntitySubscriberInterface<Album> {
    beforeInsert(event: InsertEvent<Album>) {
        console.log(`BEFORE ENTITY INSERTED: `, event.entity)
    }

    beforeUpdate(event: UpdateEvent<Album>) {
        console.log(`BEFORE ENTITY UPDATED: `, event.entity)
    }

    beforeRemove(event: RemoveEvent<Album>) {
        console.log(
            `BEFORE ENTITY WITH ID ${event.entityId} REMOVED: `,
            event.entity
        )
    }

    afterInsert(event: InsertEvent<Album>) {
        console.log(`AFTER ENTITY INSERTED: `, event.entity)
    }

    afterUpdate(event: UpdateEvent<Album>) {
        console.log(`AFTER ENTITY UPDATED: `, event.entity)
    }

    afterRemove(event: RemoveEvent<Album>) {
        console.log(
            `AFTER ENTITY WITH ID ${event.entityId} REMOVED: `,
            event.entity
        )
    }

    afterLoad(entity: Album) {
        console.log(`AFTER ENTITY LOADED: `, entity)
    }
}
