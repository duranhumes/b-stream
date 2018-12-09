import { combineReducers } from 'redux'

import clock from './clock'

export const exampleInitialState = {
    lastUpdate: 0,
    light: false,
    count: 0,
}

export default combineReducers({
    clock,
})
