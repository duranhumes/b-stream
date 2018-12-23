import { TRACK_UPLOAD, TRACK_UPLOAD_ERROR } from '../../actions/track/types'
import { badDataErrorMsg, genericErrorMsg, authErrorMsg } from './errorMessages'
import { ErrorPayloadType, ReducerType } from '../../../interfaces'

export default (state = {}, { type, payload }: ReducerType) => {
    switch (type) {
        case TRACK_UPLOAD: {
            return payload
        }
        case TRACK_UPLOAD_ERROR: {
            const { status, fields }: Partial<ErrorPayloadType> = payload
            switch (status) {
                case 403: {
                    return authErrorMsg()
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
