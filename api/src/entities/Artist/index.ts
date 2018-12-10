import { Entity, Column, ManyToMany, JoinTable } from 'typeorm'
import { Length, IsOptional } from 'class-validator'

import { Model } from '../Model'
import { Track } from '../Track'
import { Genre } from '../Genre'

@Entity('artist')
export class Artist extends Model {
    @Column({ type: 'varchar', length: 255, nullable: false })
    @Length(3, 255)
    public name: string | undefined

    @Column({ type: 'text', nullable: true })
    @IsOptional()
    public description: string | undefined

    @Column({ type: 'int', width: 11, nullable: false, default: 0 })
    public popularity: number | undefined

    @ManyToMany(() => Track, track => track.artist)
    @JoinTable({ name: 'artistTracks' })
    public tracks: Track[] | undefined

    @ManyToMany(() => Genre, genre => genre.id)
    @JoinTable({ name: 'artistGenre' })
    public genres: Genre[] | undefined
}
