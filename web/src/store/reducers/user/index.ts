import { BASIC_LOGIN, BASIC_LOGIN_ERROR } from '../../actions/user/types'

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
            const error = {}
            switch (status) {
                case 401: {
                    Object.assign(error, {
                        fields: [],
                        error: true,
                        message: 'Invalid credentials',
                    })

                    break
                }
                case 404: {
                    Object.assign(error, {
                        fields: [],
                        error: true,
                        message: "That user doesn't exist",
                    })

                    break
                }
                case 422: {
                    Object.assign(error, {
                        fields,
                        error: true,
                        message: 'Please check the fields in red',
                    })

                    break
                }
                default: {
                    Object.assign(error, {
                        fields: [],
                        error: true,
                        message: 'Something went wrong please try again',
                    })
                }
            }

            return error
        }
        default: {
            return state
        }
    }
}
