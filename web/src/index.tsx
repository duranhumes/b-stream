import * as React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'

import './index.css'
import { pages as Pages } from './pages'
import registerServiceWorker from './registerServiceWorker'

import ErrorBoundary from './ErrorBoundary'
import createStore from './store/createStore'
import Container from './pages/Container'

const { store, history } = createStore()

const appRoot = (
    <Provider store={store}>
        <Router history={history}>
            <ErrorBoundary>
                <Container>
                    <Pages />
                </Container>
            </ErrorBoundary>
        </Router>
    </Provider>
)

const docRoot = document.querySelector('#root') as HTMLElement
render(appRoot, docRoot)
registerServiceWorker()
