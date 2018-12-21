import login from './login'
import register from './register'

export default (state: any, action: any) => {
    const loginData = login(state, action)
    const registerData = register(state, action)

    return { ...loginData, ...registerData }
}
