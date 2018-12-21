import { Dispatch } from 'redux'

import request from '../../../utils/request'
import { BASIC_LOGIN, BASIC_LOGIN_ERROR } from './types'
import { loginEndpoint } from '../../../api/Endpoints'
import { checkApiHealth } from '../../../utils/checkAPIHealth'

interface UserLoginType {
    email: string
    password: string
    rememberMe: boolean
}

export const basicLogin = ({
    email,
    password,
    rememberMe,
}: UserLoginType) => async (dispatch: Dispatch) => {
    const error = await checkApiHealth(async () => {
        const r = request()
        try {
            const data = JSON.stringify({ email, password, rememberMe })
            const response = await r.post(loginEndpoint, data)
            const user = response.data.response

            localStorage.setItem('user', JSON.stringify(user))

            dispatch({
                type: BASIC_LOGIN,
                payload: user,
            })
        } catch (error) {
            dispatch({ type: BASIC_LOGIN_ERROR, payload: error.response.data })
        }
    })

    if (error) {
        dispatch({
            type: BASIC_LOGIN_ERROR,
            payload: {
                error: 'Network Error',
                message:
                    "Something went wrong on our end, we're working to fix the issue",
                status: 500,
            },
        })
    }
}
