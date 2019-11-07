import React from 'react'
import nextCookie from 'next-cookies'
import isEmpty from 'lodash.isempty'

import getHost from '../utils/get-host'

export const withAuth = (WrappedComponent: any) => {
	const Wrapper = (props) => {
		return <WrappedComponent{...props} />
	}

	Wrapper.getInitialProps = async ctx => {
		const { reduxStore } = ctx
		const state = reduxStore.getState()
		const { token } = nextCookie(ctx)

		const componentProps =
		WrappedComponent.getInitialProps &&
		(await WrappedComponent.getInitialProps(ctx))

		if (isEmpty(state.user) && token) {
			const loginResponse = await fetch(`${getHost(ctx.req)}/api/login?username=${token}`)
			const { user } = await loginResponse.json()

			reduxStore.dispatch({
				type: 'LOGIN',
				payload: user
			})
		}

		if (isEmpty(reduxStore.getState().progress) && token) {
			const progressResponse = await fetch(`${getHost(ctx.req)}/api/progress?username=${token}`)
			const {progress} = await progressResponse.json()

			reduxStore.dispatch({
				type: 'PROGRESS',
				payload: progress
			})
		}


		return {
			...componentProps,
		}
	}

	return Wrapper
}