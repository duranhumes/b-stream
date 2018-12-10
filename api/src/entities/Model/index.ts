import {
    PrimaryColumn,
    UpdateDateColumn,
    CreateDateColumn,
    BeforeInsert,
} from 'typeorm'
import * as uuid from 'uuid/v4'

export abstract class Model {
    @PrimaryColumn('uuid')
    public id: string | undefined

    @CreateDateColumn({ nullable: false })
    public createdAt: string | undefined

    @UpdateDateColumn({ nullable: false })
    public updatedAt: string | undefined

    @BeforeInsert()
    beforeInsert() {
        this.id = uuid().replace(/[^a-z0-9]/gi, '')
    }
}
