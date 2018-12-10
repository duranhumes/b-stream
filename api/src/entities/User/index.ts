import { Entity, Column, OneToMany } from 'typeorm'
import {
    IsEmail,
    IsFQDN,
    IsLowercase,
    Length,
    IsOptional,
} from 'class-validator'

import { Model } from '../Model'
import { Track } from '../Track'

export const passwordRegex = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,30}$/,
    'i'
)
export const passwordValidationMessage =
    'A valid password consists of atleast 1 uppercase letter, 1 special character, 1 number, and is between 8 - 30 characters long.'

@Entity('user')
export class User extends Model {
    @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
    @IsLowercase()
    @Length(3, 255)
    public userName: string | undefined

    @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
    @IsEmail()
    @IsLowercase()
    @Length(5, 255)
    public email: string | undefined

    @Column({ type: 'varchar', length: 255, nullable: false })
    @Length(8, 30)
    public password: string | undefined

    @Column({ type: 'varchar', length: 255, nullable: true })
    @IsFQDN()
    @IsOptional()
    public website: string | undefined

    @Column({ type: 'varchar', length: 255, nullable: true })
    @IsOptional()
    public websiteTitle: string | undefined

    @Column({ type: 'tinyint', width: 1, nullable: false, default: 0 })
    @IsOptional()
    public isConfirmed: boolean | undefined

    @OneToMany(() => Track, track => track.user)
    public tracks: Track[] | undefined
}
