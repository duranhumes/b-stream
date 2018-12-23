import login from './login'
import register from './register'

import { ReducerType } from '../../../interfaces'

export default (state = {}, action: ReducerType) => {
    const loginData = login(state, action)
    const registerData = register(state, action)

    return { ...loginData, ...registerData }
}
