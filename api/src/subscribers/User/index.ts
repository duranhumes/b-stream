import {
    EventSubscriber,
    EntitySubscriberInterface,
    InsertEvent,
    UpdateEvent,
    RemoveEvent,
} from 'typeorm'

import { User } from '../../entities'

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
    beforeInsert(event: InsertEvent<User>) {
        console.log(`BEFORE ENTITY INSERTED: `, event.entity)
    }

    beforeUpdate(event: UpdateEvent<User>) {
        console.log(`BEFORE ENTITY UPDATED: `, event.entity)
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
