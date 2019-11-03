import * as React from 'react'
import Link from 'next/link'

import { Block } from 'baseui/block'
import { StyledLink } from 'baseui/link'
import { Label1 } from 'baseui/typography'
import { StatefulPopover } from 'baseui/popover'
import { Button } from 'baseui/button'

interface Props {
	isAuthorized: boolean;
	username: string;
	logout: any;
}

function Header({isAuthorized, username, logout}): JSX.Element {
	return (
		<Block
			display={'flex'}
			alignItems={'center'}
			justifyContent={'space-between'}
			marginBottom={'scale600'}
		>
			<Link href={'/'}>
				<StyledLink href={'/'} style={{cursor: 'pointer'}}>Lista Czasowników</StyledLink>
			</Link>
			{isAuthorized ? (
				<StatefulPopover content={<Button onClick={logout}>Logout</Button>}>
					<Label1>{username}</Label1>
				</StatefulPopover>
			) : (
				<Link href={'/login'}>
					<StyledLink href={'/login'} style={{cursor: 'pointer'}}>Login</StyledLink>
				</Link>
			)}
		</Block>
	)
}

export default Header
