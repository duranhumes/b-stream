import { TICK, INCREMENT, DECREMENT, RESET } from '../actions/types'
import { exampleInitialState } from '.'

export default (state = exampleInitialState, action) => {
    switch (action.type) {
        case TICK:
            return Object.assign({}, state, {
                lastUpdate: action.ts,
                light: !!action.light,
            })
        case INCREMENT:
            return Object.assign({}, state, {
                count: state.count + 1,
            })
        case DECREMENT:
            return Object.assign({}, state, {
                count: state.count - 1,
            })
        case RESET:
            return Object.assign({}, state, {
                count: exampleInitialState.count,
            })
        default:
            return state
    }
}
