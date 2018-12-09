import { Request, Response, NextFunction } from 'express'
import { param, validationResult } from 'express-validator/check'

import { code422 } from '../../utils/httpMessages'

export const validationRules = {
    getStream: [
        param('id')
            .not()
            .isEmpty()
            .trim()
            .escape()
            .withMessage('is required for this endpoint'),
    ],
}

export function validationFunc(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errString = errors
            .array()
            .map((err: any) => `${err.param}: ${err.msg}`)
            .join(', ')

        return res.status(422).json(code422({}, errString))
    }

    return next()
}
