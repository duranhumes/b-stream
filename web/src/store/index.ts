import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import reduxThunk from 'redux-thunk'

import reducers, { exampleInitialState } from './reducers'

export function store(initialState: any = exampleInitialState) {
    return createStore(
        reducers,
        initialState,
        composeWithDevTools(applyMiddleware(reduxThunk))
    )
}
