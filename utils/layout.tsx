import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cookie from 'js-cookie'
import isEmpty from 'lodash.isempty'

import Layout from '../components/layout'

export const withLayout = (WrappedComponent: any) => {
	const Wrapper = (props) => {
		const dispatch = useDispatch()
		const user = useSelector(state => state.user)

		const logout = (): void => {
			dispatch({type: 'LOGOUT'})
			cookie.remove('token')
		}

		return (
			<Layout
				isAuthorized={!isEmpty(user)}
				username={user.username}
				logout={logout}
			>
				<WrappedComponent {...props} />
			</Layout>
		)
	}


	Wrapper.getInitialProps = async ctx => {
		const componentProps =
      WrappedComponent.getInitialProps &&
			(await WrappedComponent.getInitialProps(ctx))

		return {
			...componentProps,
		}
	}

	return Wrapper
}