import React from 'react'
import nextCookie from 'next-cookies'
import cookie from 'js-cookie'
import isEmpty from 'lodash.isempty'

import getHost from '../utils/get-host'

export const withAuth = (WrappedComponent: any) => {
	const Wrapper = ({user, ...rest}) => {
		const [isAuthorized, setIsAuthorized] = React.useState(!isEmpty(user))

		function handleLogout(): void {
			cookie.remove('token')
			setIsAuthorized(false)
		}

		return <WrappedComponent
			isAuthorized={isAuthorized}
			username={user ? user.username : null}
			logout={handleLogout}
			{...rest}
		/>
	}

	Wrapper.getInitialProps = async ctx => {
		const componentProps =
      WrappedComponent.getInitialProps &&
			(await WrappedComponent.getInitialProps(ctx))

		const { token } = nextCookie(ctx)

		const loginResponse = await fetch(`${getHost(ctx.req)}/api/login?username=${token}`)
		const progressResponse = await fetch(`${getHost(ctx.req)}/api/progress?username=${token}`)

		const { user } = await loginResponse.json()
		const {progress} = await progressResponse.json()

		return {
			...componentProps,
			user,
			progress
		}
	}

	return Wrapper
}