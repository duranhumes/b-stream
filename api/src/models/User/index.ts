import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm'
import { IsEmail, MinLength, MaxLength, validate } from 'class-validator'

import { Model } from '../Model'
import { hashPassword } from '../../lib/auth/password'

export const passwordRegex = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,30}$/,
    'i'
)
export const passwordValidationMessage =
    'A valid password consists of atleast 1 uppercase letter, 1 special character, 1 number, and is between 8 - 30 characters long.'

@Entity('users')
export class User extends Model {
    @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
    @MinLength(3)
    @MaxLength(255)
    public userName: string | undefined

    @Column({ type: 'varchar', length: 255, unique: true, nullable: false })
    @IsEmail()
    @MinLength(5)
    @MaxLength(255)
    public email: string | undefined

    @Column({ type: 'varchar', length: 255, nullable: false })
    @MinLength(8)
    @MaxLength(30)
    public password: string | undefined

    @BeforeInsert()
    public async beforeInsert() {
        await validateData(this)

        if (this.userName && this.email && this.password) {
            this.userName = this.userName.replace(/\s+/g, '-').toLowerCase()
            this.email = this.email.toLowerCase()
            if (this.password !== String(process.env.DEFAULT_OAUTH_PASSWORD)) {
                if (validatePassword(this.password)) {
                    const hashedPassword = await hashPassword(this.password)
                    if (hashedPassword) {
                        this.password = hashedPassword
                    } else {
                        throw new Error('In password hash.')
                    }
                } else {
                    throw new TypeError(passwordValidationMessage)
                }
            }
        }
    }

    @BeforeUpdate()
    public async beforeUpdate() {
        await validateData(this)

        if (this.email) {
            this.email = this.email.toLowerCase()
        }
        if (this.userName) {
            this.userName = this.userName.replace(/\s+/g, '-').toLowerCase()
        }

        // Skip password validation if password is already hashed and hasn't changed or is empty
        if (this.password && !this.password.startsWith('$argon2id')) {
            if (validatePassword(this.password)) {
                const hashedPassword = await hashPassword(this.password)
                if (hashedPassword) {
                    this.password = hashedPassword
                } else {
                    throw new Error('In password hash.')
                }
            } else {
                throw new TypeError(passwordValidationMessage)
            }
        }
    }
}

async function validateData(data: Partial<User>) {
    try {
        const errors = await validate(data)
        if (errors.length > 0) {
            throw new TypeError(errors.toString())
        }
    } catch (err) {
        throw new Error(err.toString())
    }
}

function validatePassword(password: string) {
    return passwordRegex.test(password)
}
