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

@Entity('album')
export class Album extends Model {
    @Column({ type: 'varchar', length: 255, nullable: false })
    @MinLength(3)
    @MaxLength(255)
    public name: string | undefined

    @Column({ type: 'text', nullable: true })
    public description: string | undefined

    @Column({ type: 'tinyint', width: 2, default: 1 })
    public isDownloadable: boolean | undefined

    @Column({ type: 'int', width: 2 })
    public timesPlayed: number | undefined

    @Column({ type: 'int', width: 2 })
    public trackNumber: number | undefined

    @Column({ type: 'text', nullable: true })
    public tags: string | undefined

    @ManyToMany(() => Track, track => track.album)
    @JoinTable({ name: 'albumTrack' })
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
