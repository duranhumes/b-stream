import { TICK, INCREMENT, DECREMENT, RESET } from './types'

export const serverRenderClock = isServer => dispatch => {
    return dispatch({
        type: TICK,
        light: !isServer,
        ts: Date.now(),
    })
}

export const startClock = dispatch => {
    return setInterval(() => {
        dispatch({ type: TICK, light: true, ts: Date.now() })
    }, 1000)
}

export const incrementCount = () => dispatch => {
    return dispatch({ type: INCREMENT })
}

export const decrementCount = () => dispatch => {
    return dispatch({ type: DECREMENT })
}

export const resetCount = () => dispatch => {
    return dispatch({ type: RESET })
}
