import React from 'react'
import { LightTheme, BaseProvider } from 'baseui'

import Home from './conjugate'

const Index = () => {
	return (
		<BaseProvider theme={LightTheme}>
			<Home />
		</BaseProvider>
	)
}

export default Index
