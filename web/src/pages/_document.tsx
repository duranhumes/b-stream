import * as React from 'react'
import document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

import '../static/css/_global.css'

const Document = document
export default class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const sheet = new ServerStyleSheet()

        const originalRenderPage = ctx.renderPage
        ctx.renderPage = () =>
            originalRenderPage({
                enhanceApp: App => props =>
                    sheet.collectStyles(<App {...props} />),
            })

        const initialProps: any = await Document.getInitialProps(ctx)
        return {
            ...initialProps,
            styles: [...initialProps.styles, ...sheet.getStyleElement()],
        }
    }

    render() {
        return (
            <html lang="en">
                <Head>
                    <meta
                        name="viewport"
                        content="initial-scale=1.0, width=device-width"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        )
    }
}
