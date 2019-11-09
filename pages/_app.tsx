import React from 'react'
import App from 'next/app'
import { Provider as StyletronProvider } from 'styletron-react'
import { LightTheme, BaseProvider } from 'baseui'
import { ToasterContainer, PLACEMENT } from 'baseui/toast'

import { styletron, debug } from '../styletron'

export default class MyApp extends App {
	render () {
		const { Component, pageProps } = this.props
		return (
			<StyletronProvider value={styletron} debug={debug} debugAfterHydration>
				<BaseProvider theme={LightTheme}>
					<ToasterContainer placement={PLACEMENT.topRight}>
						<Component {...pageProps} />
					</ToasterContainer>
				</BaseProvider>
			</StyletronProvider>
		)
	}
}
