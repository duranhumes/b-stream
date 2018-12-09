import {
    Entity,
    Column,
    BeforeInsert,
    BeforeUpdate,
    ManyToMany,
    JoinTable,
} from 'typeorm'
import { MinLength, MaxLength, validate } from 'class-validator'

import { Model } from '../Model'
import { Track } from '../Track'

@Entity('genre')
export class Genre extends Model {
    @Column({ type: 'varchar', length: 255, nullable: false })
    @MinLength(3)
    @MaxLength(255)
    public name: string | undefined

    @Column({ type: 'text', nullable: true })
    public description: string | undefined

    @ManyToMany(() => Track, track => track.id)
    @JoinTable({ name: 'trackGenre' })
    public tracks: Track[] | undefined

    @BeforeInsert()
    public async beforeInsert() {
        await validateData(this)
    }

    @BeforeUpdate()
    public async beforeUpdate() {
        //
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
