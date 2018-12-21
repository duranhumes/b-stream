import { BASIC_LOGIN, BASIC_LOGIN_ERROR } from '../../actions/user/types'
import {
    badDataErrorMsg,
    genericErrorMsg,
    userNotFoundErrorMsg,
    invalidCredentialsMsg,
} from './errorMessages'

interface ReducerType {
    type: string
    payload: object
}

interface ErrorPayloadType {
    error: string
    message: string
    status: number
    fields?: string[]
}

export default (state = {}, { type, payload }: ReducerType) => {
    switch (type) {
        case BASIC_LOGIN: {
            return { ...payload }
        }
        case BASIC_LOGIN_ERROR: {
            const { status, fields }: Partial<ErrorPayloadType> = payload
            switch (status) {
                case 401: {
                    return invalidCredentialsMsg()
                }
                case 404: {
                    return userNotFoundErrorMsg()
                }
                case 422: {
                    return badDataErrorMsg(fields)
                }
                default: {
                    return genericErrorMsg()
                }
            }
        }
        default: {
            return state
        }
    }
}
