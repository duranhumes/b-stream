import {
    TRACK_UPLOAD,
    TRACK_ERROR,
    GET_TRACK,
    GET_TRACKS,
} from '../../actions/track/types'
import {
    badDataErrorMsg,
    genericErrorMsg,
    authErrorMsg,
    trackNotFoundErrorMsg,
} from './errorMessages'
import { ErrorPayloadType, ReducerType } from '../../../interfaces'

export default (state = {}, { type, payload }: ReducerType) => {
    switch (type) {
        case GET_TRACK: {
            return payload
        }
        case GET_TRACKS: {
            return payload
        }
        case TRACK_UPLOAD: {
            return payload
        }
        case TRACK_ERROR: {
            const { status, fields }: Partial<ErrorPayloadType> = payload
            switch (status) {
                case 403: {
                    return authErrorMsg()
                }
                case 404: {
                    return trackNotFoundErrorMsg()
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
