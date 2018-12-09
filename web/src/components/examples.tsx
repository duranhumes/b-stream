import Link from 'next/link'
import { connect } from 'react-redux'
import styled from '../styled'

import Clock from './clock'
import Counter from './counter'

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

function Examples({ lastUpdate, light }) {
    return (
        <div>
            <Clock lastUpdate={lastUpdate} light={light} />
            <Counter />
            <Link href="/login">
                <a>Login</a>
            </Link>
            <Loader />
        </div>
    )
}

function mapStateToProps({ clock: { lastUpdate, light } }) {
    return { lastUpdate, light }
}

export default connect(mapStateToProps)(Examples)
