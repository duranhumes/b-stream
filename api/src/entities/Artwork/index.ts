import { Column } from 'typeorm'

import { Model } from '../Model'

export abstract class Artwork extends Model {
    @Column({ type: 'text', nullable: false })
    public imageUrl: string | undefined

    @Column({ type: 'int', width: 2, nullable: false })
    public width: string | undefined

    @Column({ type: 'int', width: 2, nullable: false })
    public height: string | undefined
}
