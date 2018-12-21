import axios from 'axios'

import { healthEndpoint } from '../api/Endpoints'

export async function checkApiHealth(cb: any) {
    try {
        const check = await axios({
            url: healthEndpoint,
            method: 'GET',
        })

        if (!check || !check.data) {
            return 'Error'
        }

        await cb()
    } catch (error) {
        console.log({ error })

        return error
    }
}
