import { Router, Response, Request } from 'express'

import Controller from '../Controller'
import * as httpMessages from '../../utils/httpMessages'
import { logger } from '../../utils/logging'
import { UserServices } from '../../services/UserServices'
import { validationRules, validationFunc } from './validation'
import seedUsers from '../../database/seeders/seedUsers'
import { promisify, pick } from '../../utils'
import UserSchema from '../../schemas/UserSchema'

class UserController extends Controller {
    public router: Router

    public constructor() {
        super()

        this.router = Router()
        this.routes()
    }

    public routes() {
        this.router.get('/', this.getUsers)
        this.router.post(
            '/seed',
            [...validationRules.seeder],
            validationFunc,
            this.seeder
        )
        this.router.post(
            '/',
            [...validationRules.createUser],
            validationFunc,
            this.createUser
        )
        this.router.get(
            '/:id',
            [...validationRules.getUser],
            validationFunc,
            this.getUser
        )
        this.router.patch(
            '/:id',
            [...validationRules.updateUser],
            validationFunc,
            this.updateUser
        )
        this.router.delete(
            '/:id',
            [...validationRules.deleteUser],
            validationFunc,
            this.deleteUser
        )
    }

    /**
     * Seeds db with users,
     *
     * @field {number} amount of users to create
     */
    private seeder = async (req: Request, res: Response): Promise<any> => {
        const amountOfUsers = Number(this.escapeString(req.query.amount).trim())

        await seedUsers(amountOfUsers)

        const [users, usersErr]: [any, any] = await promisify(
            UserServices.findAll()
        )
        if (usersErr) {
            logger(req.ip, usersErr, 500)

            return res.status(500).json({
                status: 500,
                error: 'Unknown',
                message: 'Something went wrong, please try again',
            })
        }

        const existingUsersCount = users.length

        return res
            .status(200)
            .json(
                httpMessages.code200(
                    {},
                    `${amountOfUsers} users created. There are ${existingUsersCount} users now in DB.`
                )
            )
    }

    /**
     * Creates a user with required fields
     *
     * @field userName
     * @field email
     * @field password
     */
    private createUser = async (req: any, res: Response): Promise<any> => {
        // Filter sent data based on schema
        const filteredData = pick(req.body, UserSchema)
        const data = {}
        for (const key in filteredData) {
            if (filteredData.hasOwnProperty(key)) {
                data[key] = this.escapeString(filteredData[key]).trim()
            }
        }

        /**
         * Create & save new user
         */
        const [userId, userIdErr]: [any, any] = await promisify(
            UserServices.create(filteredData)
        )

        if (userIdErr) {
            if (Number(userIdErr.code) === 409) {
                logger(req.ip, userIdErr, 409)

                return res.status(409).json(httpMessages.code409())
            }

            logger(req.ip, userIdErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        if (!userId) {
            return res.status(500).json(httpMessages.code500())
        }

        /**
         * Find new user
         */
        const [newUser, newUserErr]: [any, any] = await promisify(
            UserServices.findOne('id', userId)
        )
        if (newUserErr) {
            logger(req.ip, newUserErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        if (!newUser) {
            return res.status(500).json(httpMessages.code500())
        }

        /**
         * Login user, send user info back
         * along with jsonwebtoken as a way to
         * verify who the user is in
         * subsequent requests
         */
        req.login(newUser.id, (err: any) => {
            if (err) {
                logger(req.ip, err, 500)

                return res.status(500).json(httpMessages.code500())
            }

            // Return user obj
            const response = {
                ...newUser,
            }

            req.session!.user = newUser.id

            res.set('X-USER-TOKEN', req.sessionID)
            return res.status(201).json(httpMessages.code201(response))
        })

        return
    }

    /**
     * Returns a single user object
     */
    private getUser = async (req: Request, res: Response): Promise<any> => {
        const userId = this.escapeString(req.params.id).trim()

        const [user, userErr] = await promisify(
            UserServices.findOne('id', userId)
        )
        if (userErr) {
            if (userErr.code === 404) {
                logger(req.ip, userErr, 404)

                return res.status(404).json(httpMessages.code404())
            }

            logger(req.ip, userErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        return res.status(200).json(httpMessages.code200(user))
    }

    /**
     * Returns an array of users
     */
    private getUsers = async (req: Request, res: Response): Promise<any> => {
        const [users, usersErr] = await promisify(UserServices.findAll())
        if (usersErr) {
            logger(req.ip, usersErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        return res.status(200).json(httpMessages.code200(users))
    }

    /**
     * Updates a user
     */
    private updateUser = async (req: any, res: Response): Promise<any> => {
        const userId = this.escapeString(req.params.id).trim()

        /**
         * Check if user can perform this action
         */
        // console.table(req.user)
        // if (req.user.id !== userId) {
        //     return res.status(403).json(httpMessages.code403())
        // }

        /**
         * Find user
         */
        const [user, userErr]: [any, any] = await promisify(
            UserServices.findOne('id', userId, false)
        )
        if (userErr) {
            if (userErr.code === 404) {
                logger(req.ip, userErr, 404)

                return res.status(404).json(httpMessages.code404())
            }

            logger(req.ip, userErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        if (!user) {
            return res.status(404).json(httpMessages.code404())
        }

        // Filter sent data based on schema
        const filteredData = pick(req.body, UserSchema)

        /**
         * Update fields
         */
        const data = {}
        for (const key in filteredData) {
            if (filteredData.hasOwnProperty(key)) {
                data[key] = this.escapeString(filteredData[key]).trim()
            }
        }

        /**
         * Save updated user
         */
        const [updatedUser, updatedUserErr]: [any, any] = await promisify(
            UserServices.update(user, data)
        )
        if (updatedUserErr) {
            logger(req.ip, updatedUserErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        if (!updatedUser) {
            return res.status(404).json(httpMessages.code404())
        }

        return res
            .status(200)
            .json(
                httpMessages.code200(updatedUser, 'User successfully updated.')
            )
    }

    /**
     * Deletes user found by id
     */
    private deleteUser = async (req: Request, res: Response): Promise<any> => {
        const userId = this.escapeString(req.params.id).trim()

        /**
         * Check if user can perform this action
         */
        // if (req.user.id !== userId) {
        //     return res.status(403).json(httpMessages.code403())
        // }

        /**
         * Find user
         */
        const [user, userErr]: [any, any] = await promisify(
            UserServices.findOne('id', userId, false)
        )
        if (userErr) {
            if (userErr.code === 404) {
                logger(req.ip, userErr, 404)

                return res.status(404).json(httpMessages.code404())
            }

            logger(req.ip, userErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        if (!user) {
            return res.status(404).json(httpMessages.code404())
        }

        /**
         * Remove user
         */
        const [, deleteUserErr] = await promisify(
            await UserServices.remove(userId)
        )
        if (deleteUserErr) {
            logger(req.ip, deleteUserErr, 500)

            return res.status(500).json(httpMessages.code500())
        }

        return res.status(200).json(httpMessages.code200({}))
    }
}

export default new UserController().router
