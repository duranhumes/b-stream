import * as React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
export default class MyDocument extends Document {
    static async getInitialProps(ctx: any) {
        const sheet = new ServerStyleSheet()

        const originalRenderPage = ctx.renderPage
        ctx.renderPage = () =>
            originalRenderPage({
                enhanceApp: (App: any) => (props: any) =>
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
                    <link
                        rel="stylesheet"
                        href="https://use.fontawesome.com/releases/v5.6.1/css/all.css"
                    />
                    <link rel="stylesheet" href="/static/css/bracket.min.css" />
                    <link rel="stylesheet" href="/static/css/_global.css" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        )
    }
}
