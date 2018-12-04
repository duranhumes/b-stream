import {
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
} from 'typeorm'

export abstract class Model {
    @PrimaryGeneratedColumn('uuid')
    public id: string | undefined

    @CreateDateColumn({ nullable: false })
    public createdAt: string | undefined

    @UpdateDateColumn({ nullable: false })
    public updatedAt: string | undefined
}
