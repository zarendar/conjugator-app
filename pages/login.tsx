// @flow
import { useRouter } from 'next/router'
import React from 'react'
import {useDispatch} from 'react-redux'
import cookie from 'js-cookie'
import fetch from 'isomorphic-unfetch'
import isEmpty from 'lodash.isempty'

import Form from '../components/form'

import { withRedux } from '../utils/redux'

interface ValidationResult {
	errors: Record<string, string>;
	success: Record<string, string>;
}

const USERNAME = 'Nazwa Użytkownika'

const inputs = [USERNAME]

function validate(formData: Record<string, string>): ValidationResult {
	const errors = {}
	const success = {}

	if (isEmpty(formData[USERNAME])) {
		errors[USERNAME] = 'Wymagana jest nazwa użytkownika'
	} else {
		success[USERNAME] = true
	}

	return {
		errors,
		success,
	}
}

function Login(): JSX.Element {
	const router = useRouter()
	const dispatch = useDispatch()
	const [isLoginLoading, setIsLoginLoading] = React.useState(false)

	async function handleFormSubmit(formData: Record<string, string>): Promise<void> {
		setIsLoginLoading(true)

		try {
			const response = await fetch(`/api/login?username=${formData[USERNAME]}`)
			const { user } = await response.json()

			if (user._id) {
				dispatch({
					type: 'LOGIN',
					payload: user
				})

				cookie.set('token', formData[USERNAME])
				router.push('/')
			}
		} catch (error) {
			setIsLoginLoading(false)
		}
	}

	return (
		<Form
			title={'Zaloguj się'}
			inputs={inputs}
			isSubmitting={isLoginLoading}
			submitButtonText={'Zatwierdź'}
			validation={validate}
			onFormSubmit={handleFormSubmit}
		/>
	)
}

export default withRedux(Login)
