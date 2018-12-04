import * as React from 'react'

import styled, { ThemeProvider } from '../../styled'
import { theme } from '../../constants'

const Cont = styled.div`
    margin: 0 auto;
    padding: 0;
    text-align: center;
`

class Container extends React.Component {
    public render() {
        return (
            <ThemeProvider theme={theme}>
                <Cont>{this.props.children}</Cont>
            </ThemeProvider>
        )
    }
}

export default Container
