import * as React from 'react'
import { Block } from 'baseui/block'

import Header from './header'
import Search from './search'

interface Props {
	isAuthorized: boolean;
	username: string;
	logout: any;
	children: JSX.Element[] | JSX.Element;
}

function Layout({ isAuthorized, username, logout, children }: Props): JSX.Element {
	return (
		<Block padding={'scale300'}>
			<Header isAuthorized={isAuthorized} username={username} logout={logout}/>
			<Search />
			<Block paddingTop={'scale300'} paddingBottom={'scale300'}>
				{children}
			</Block>
		</Block>
	)
}

export default Layout
