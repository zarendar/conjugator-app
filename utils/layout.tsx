import React from 'react'
import Layout from '../components/layout'

export const withLayout = (WrappedComponent: any) => {
	const Wrapper = ({ isAuthorized, username, logout, ...rest }) => {
		return (
			<Layout
				isAuthorized={isAuthorized}
				username={username}
				logout={logout}
			>
				<WrappedComponent {...rest} />
			</Layout>
		)
	}

	return Wrapper
}