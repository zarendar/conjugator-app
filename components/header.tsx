import * as React from 'react'
import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import cookie from 'js-cookie'
import isEmpty from 'lodash.isempty'

import { Block } from 'baseui/block'
import { StyledLink } from 'baseui/link'
import { Label2 } from 'baseui/typography'
import { StatefulPopover } from 'baseui/popover'
import { Button } from 'baseui/button'

import { FaUser } from 'react-icons/fa'

const usernameStyle = {
	marginBottom: 0,
	marginTop: 0,
	marginLeft: '10px',
	lineHeight: 'normal'
}

const linkStyle = { cursor: 'pointer' }

function Header(): JSX.Element {
	const user = useSelector(state => state.user)
	const dispatch = useDispatch()

	function handleButtonClick(): void {
		dispatch({ type: 'LOGOUT' })
		dispatch({ type: 'PROGRESS', payload: {} })

		cookie.remove('token')
	}

	return (
		<Block
			display={'flex'}
			justifyContent={'space-between'}
			marginBottom={'scale600'}
		>
			<Link href={'/'}>
				<StyledLink href={'/'} style={linkStyle}>Lista Czasowników</StyledLink>
			</Link>
			{isEmpty(user) ? (
				<Link href={'/login'}>
					<StyledLink href={'/login'} style={linkStyle}>Zaloguj się</StyledLink>
				</Link>
			) : (
				<StatefulPopover content={<Button onClick={handleButtonClick}>Wyloguj</Button>}>
					<Block display={'flex'} alignItems={'center'} $style={linkStyle}>
						<FaUser />
						<Label2 $style={usernameStyle}>
							{user.username}
						</Label2>
					</Block>
				</StatefulPopover>
			)}
		</Block>
	)
}

export default Header
