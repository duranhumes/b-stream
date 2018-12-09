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
import { Genre } from '../Genre'

@Entity('artist')
export class Artist extends Model {
    @Column({ type: 'varchar', length: 255, nullable: false })
    @MinLength(3)
    @MaxLength(255)
    public name: string | undefined

    @Column({ type: 'text', nullable: true })
    public description: string | undefined

    @Column({ type: 'int', width: 2 })
    public popularity: number | undefined

    @ManyToMany(() => Track, track => track.artist)
    @JoinTable({ name: 'artistTracks' })
    public tracks: Track[] | undefined

    @ManyToMany(() => Genre, genre => genre.id)
    @JoinTable({ name: 'artistGenre' })
    public genres: Genre[] | undefined

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
