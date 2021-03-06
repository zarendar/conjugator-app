import React from 'react'
import nextCookie from 'next-cookies'
import cookie from 'js-cookie'
import isEmpty from 'lodash.isempty'
import fetch from 'isomorphic-unfetch'

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
			const loginResponse = await fetch(`${getHost(ctx.req)}/api/me`, {
				headers: {
					'authorization': token,
				}
			})
			const { error, user } = await loginResponse.json()

			if (error) {
				cookie.remove('token')
				return
			}

			reduxStore.dispatch({
				type: 'LOGIN',
				payload: user
			})
		}

		if (isEmpty(state.progress) && token) {
			const progressResponse = await fetch(`${getHost(ctx.req)}/api/progress`, {
				headers: {
					'authorization': token,
				}
			})
			const { error, progress } = await progressResponse.json()

			if (error) {
				cookie.remove('token')
				return
			}

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