import * as React from 'react'
import { connect } from 'react-redux'

import { startClock, serverRenderClock } from '../store/actions'
import Examples from '../components/examples'

class Index extends React.Component {
    static getInitialProps({ reduxStore, req }) {
        const isServer = !!req
        reduxStore.dispatch(serverRenderClock(isServer))

        return {}
    }

    timer: any

    componentDidMount() {
        const { dispatch }: any = this.props
        this.timer = startClock(dispatch)
        console.log(process.env.APP_NAME)
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    render() {
        return <Examples />
    }
}

export default connect()(Index)
