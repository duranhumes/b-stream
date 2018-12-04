import { createStore, applyMiddleware, compose } from 'redux'
import { createBrowserHistory } from 'history'
import reduxThunk from 'redux-thunk'

import reducers from './reducers'

export default function() {
    const enhancers = []
    if (process.env.NODE_ENV === 'development') {
        const devToolsExtension = (window as any).devToolsExtension

        if (typeof devToolsExtension === 'function') {
            enhancers.push(devToolsExtension())
        }
    }

    const middleware = [reduxThunk]
    const composedEnhancers = compose(
        reducers,
        applyMiddleware(...middleware),
        ...enhancers
    )

    return {
        history: createBrowserHistory(),
        store: createStore(composedEnhancers),
    }
}
