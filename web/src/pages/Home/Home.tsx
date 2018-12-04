import * as React from 'react'

import styled from '../../styled'

const Title = styled.h2`
    font-size: 1.5em;
    color: ${props => props.theme.color.blue};
`

class Home extends React.Component {
    public render() {
        return (
            <div className="Home">
                <Title>Home</Title>
            </div>
        )
    }
}

export default Home
