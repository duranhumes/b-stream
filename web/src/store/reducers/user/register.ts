import { BASIC_REGISTER, BASIC_REGISTER_ERROR } from '../../actions/user/types'
import {
    badDataErrorMsg,
    duplicateUserMsg,
    genericErrorMsg,
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
        case BASIC_REGISTER: {
            return { ...payload }
        }
        case BASIC_REGISTER_ERROR: {
            const {
                status,
                fields,
                message,
            }: Partial<ErrorPayloadType> = payload
            switch (status) {
                case 409: {
                    return duplicateUserMsg()
                }
                case 422: {
                    if (fields && fields.includes('password')) {
                        const moddedMessage = `Please check your password: ${
                            message!.split('password:')[1]
                        }`
                        return badDataErrorMsg(fields, {
                            message: moddedMessage,
                        })
                    }

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
