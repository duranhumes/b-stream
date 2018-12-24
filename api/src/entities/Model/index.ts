import {
    PrimaryColumn,
    UpdateDateColumn,
    CreateDateColumn,
    BeforeInsert,
} from 'typeorm'

import { formattedUUID } from '../../utils'

export abstract class Model {
    @PrimaryColumn('uuid')
    public id: string | undefined

    @CreateDateColumn({ nullable: false })
    public createdAt: string | undefined

    @UpdateDateColumn({ nullable: false })
    public updatedAt: string | undefined

    @BeforeInsert()
    beforeInsert() {
        this.id = formattedUUID()
    }
}
