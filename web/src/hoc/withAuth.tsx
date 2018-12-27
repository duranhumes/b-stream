import * as React from 'react'
import Router from 'next/router'

import { Loader } from '../components'
import request from '../utils/request'
import { authEndpoint } from '../api/Endpoints'

function withAuth(Page: any) {
    return class WithAuth extends React.Component<any, any> {
        state = {
            isLoading: true,
        }

        async componentDidMount() {
            const unParsedUser = localStorage.getItem('user')
            const user = unParsedUser && JSON.parse(unParsedUser)
            if (!user || !user.id) {
                return Router.push('/login')
            }

            const r = request()
            try {
                await r.get(authEndpoint)
            } catch (err) {
                return Router.push('/login')
            }

            return this.setState({ isLoading: false })
        }

        render() {
            return this.state.isLoading ? <Loader /> : <Page />
        }
    }
}

export default withAuth
