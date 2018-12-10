import { Entity, Column, ManyToMany, JoinTable } from 'typeorm'
import { Length, IsOptional } from 'class-validator'

import { Model } from '../Model'
import { Track } from '../Track'

@Entity('genre')
export class Genre extends Model {
    @Column({ type: 'varchar', length: 255, nullable: false })
    @Length(3, 255)
    public name: string | undefined

    @Column({ type: 'text', nullable: true })
    @IsOptional()
    public description: string | undefined

    @ManyToMany(() => Track, track => track.id)
    @JoinTable({ name: 'trackGenre' })
    public tracks: Track[] | undefined
}
