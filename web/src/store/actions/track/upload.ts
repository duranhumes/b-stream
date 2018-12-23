import { Dispatch } from 'redux'

import request from '../../../utils/request'
import checkAPIHealth from '../../../utils/checkAPIHealth'
import { tracksEndpoint } from '../../../api/Endpoints'
import { TRACK_UPLOAD, TRACK_UPLOAD_ERROR } from './types'
import { networkErrorMsg } from '../errorMessages'
import { TrackUpload } from '../../../interfaces'

export const uploadTrack = (trackData: TrackUpload) => async (
    dispatch: Dispatch
) => {
    const error = await checkAPIHealth(async () => {
        const r = request({
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        try {
            const response = await r.post(tracksEndpoint, trackData)
            const track = response.data.response

            dispatch({
                type: TRACK_UPLOAD,
                payload: track,
            })
        } catch (error) {
            dispatch({ type: TRACK_UPLOAD_ERROR, payload: error.response.data })
        }
    })

    if (error) {
        dispatch({
            type: TRACK_UPLOAD_ERROR,
            payload: networkErrorMsg,
        })
    }
}
