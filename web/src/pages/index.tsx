import * as React from 'react'
import Link from 'next/link'
import Header from '../components/Header'
import Wrapper from '../components/Wrapper'

class Index extends React.Component {
    render() {
        return (
            <>
                <Header />
                <Wrapper>
                    <h1>Index goes here</h1>
                    <Link href="/login">
                        <a className="btn btn-primary btn-sm">Login</a>
                    </Link>
                </Wrapper>
            </>
        )
    }
}

export default Index
