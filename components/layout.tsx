import * as React from 'react'
import { LightTheme, BaseProvider } from 'baseui'
import { Block } from 'baseui/block'
import { StyledLink } from 'baseui/link'
import Link from 'next/link'

import Search from './search'

function Layout({ children }) {
	return (
		<BaseProvider theme={LightTheme}>
			<Block padding={'scale300'}>
				<Block marginBottom={'scale600'}>
					<Link href={'/'}>
						<StyledLink href={'/'} style={{cursor: 'pointer'}}>Lista Czasowników</StyledLink>
					</Link>
				</Block>
				<Search />
				<Block paddingTop={'scale300'} paddingBottom={'scale300'}>
					{children}
				</Block>
			</Block>
		</BaseProvider>
	)
}

export default Layout
