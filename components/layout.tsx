import * as React from 'react'
import { Block } from 'baseui/block'

import Header from './header'
import Search from './search'

interface Props {
	children: JSX.Element[] | JSX.Element;
}

function Layout({children }: Props): JSX.Element {
	return (
		<Block padding={'scale300'}>
			<Header />
			<Search />
			<Block paddingTop={'scale300'} paddingBottom={'scale300'}>
				{children}
			</Block>
		</Block>
	)
}

export default Layout
