import * as React from 'react'
import * as Loadable from 'react-loadable'
import { Route, Switch } from 'react-router-dom'

import NotFound from './NotFound'

const Home = Loadable({
    loader: (): Promise<any> => import('./Home'),
    loading: () => <p>Loading...</p>,
    modules: ['home'],
})

export const pages = () => (
    <Switch>
        <Route exact={true} path="/" component={Home} />
        <Route component={NotFound} />
    </Switch>
)
