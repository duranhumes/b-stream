import * as React from 'react'
import app, { Container } from 'next/app'
import { PageTransition } from 'next-page-transitions'
import { Provider } from 'react-redux'
import styled from '../styled'

import '../static/css/_global.css'
import withRedux from '../hoc/withRedux'

const Loader = styled.div`
    border: 8px solid #f3f3f3;
    border-top: 8px solid #3498db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 2s linear infinite;
    margin-left: auto;
    margin-right: auto;
    margin-top: 40px;
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`

const App = app
class MyApp extends App {
    static async getInitialProps({ Component, ctx }) {
        let pageProps = {}

        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx)
        }

        return { pageProps }
    }

    props: any

    render() {
        const { Component, pageProps, reduxStore } = this.props
        return (
            <Container>
                <Provider store={reduxStore}>
                    <PageTransition
                        timeout={400}
                        classNames="page-transition"
                        loadingComponent={<Loader />}
                        loadingDelay={500}
                        loadingTimeout={{
                            enter: 400,
                            exit: 0,
                        }}
                        loadingClassNames="loading-indicator">
                        <Component {...pageProps} />
                    </PageTransition>
                </Provider>
            </Container>
        )
    }
}

export default withRedux(MyApp)
