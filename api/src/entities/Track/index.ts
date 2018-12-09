import {
    Entity,
    Column,
    OneToMany,
    ManyToOne,
    ManyToMany,
    JoinTable,
} from 'typeorm'
import { MinLength, MaxLength } from 'class-validator'
import * as uuid from 'uuid/v4'

import { Model } from '../Model'
import { TrackArtwork } from '../TrackArtwork'
import { Album } from '../Album'
import { Artist } from '../Artist'
import { Genre } from '../Genre'
import { User } from '../User'

const allowedTrackFileExt = ['mp4', 'mp3']

@Entity('track')
export class Track extends Model {
    @Column({ type: 'varchar', length: 255, nullable: false })
    @MinLength(3)
    @MaxLength(255)
    public name: string | undefined

    @Column({ type: 'text', nullable: true })
    public description: string | undefined

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        default: modifiedUUID(),
    })
    public fileName: string | undefined

    @Column({ type: 'enum', enum: allowedTrackFileExt, nullable: false })
    public fileExt: string | undefined

    @Column({ type: 'int', width: 2, nullable: false })
    public duration: number | undefined

    @Column({ type: 'int', width: 2, nullable: false, default: 0 })
    public timesPlayed: number | undefined

    @Column({ type: 'int', width: 2, nullable: false, default: 0 })
    public trackNumber: number | undefined

    @Column({ type: 'tinyint', width: 2, default: 1 })
    public isDownloadable: boolean | undefined

    @Column({ type: 'tinyint', width: 2, nullable: false, default: 0 })
    public isExplicit: boolean | undefined

    @Column({ type: 'text', nullable: true })
    public tags: string | undefined

    @OneToMany(() => TrackArtwork, trackArtwork => trackArtwork.track)
    public trackArtwork: TrackArtwork[] | undefined

    @ManyToOne(() => Album, album => album.id)
    public album: Album | undefined

    @ManyToMany(() => Artist, artist => artist.id)
    public artist: Artist | undefined

    @ManyToMany(() => Genre, genre => genre.id)
    @JoinTable({ name: 'trackGenre' })
    public genres: Genre[] | undefined

    @ManyToOne(() => User, user => user.id)
    public user: User | undefined
}

function modifiedUUID() {
    return uuid().replace('-', '')
}
