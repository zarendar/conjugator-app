import * as React from 'react'
import { Block } from 'baseui/block'
import { StyledLink } from 'baseui/link'
import Link from 'next/link'

import Search from './search'

interface Props {
	children: JSX.Element[] | JSX.Element;
}

function Layout({ children }: Props): JSX.Element {
	return (
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
	)
}

export default Layout
