import login from './login'
import register from './register'

export interface ReducerType {
    type: string
    payload: object
}

export interface ErrorPayloadType {
    error: string
    message: string
    status: number
    fields?: string[]
}

export default (state = {}, action: ReducerType) => {
    const loginData = login(state, action)
    const registerData = register(state, action)

    return { ...loginData, ...registerData }
}
