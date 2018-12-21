import request from './request'
import { healthEndpoint } from '../api/Endpoints'

export async function checkApiHealth(cb: any) {
    const r = request()
    try {
        const check = await r.get(healthEndpoint)

        if (!check || !check.data) {
            return 'Error'
        }

        await cb()
    } catch (error) {
        console.log({ error })

        return error
    }
}
