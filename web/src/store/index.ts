import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import reduxThunk from 'redux-thunk'

import reducers from './reducers'

export function store(initialState = {}) {
    return createStore(
        reducers,
        initialState,
        composeWithDevTools(applyMiddleware(reduxThunk))
    )
}
