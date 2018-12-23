import upload from './upload'

import { ReducerType } from '../../../interfaces'

export default (state = {}, action: ReducerType) => {
    const uploadData = upload(state, action)

    return { ...uploadData }
}
