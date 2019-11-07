// @flow
import { useRouter } from 'next/router'
import cookie from 'js-cookie'
import React from 'react'
import fetch from 'unfetch'
import isEmpty from 'lodash.isempty'

import Form from '../components/form'

const USERNAME = 'Nazwa Użytkownika'

interface FormData extends Record<string, string> {
	[USERNAME]: string;
}

interface Errors {
	[USERNAME]?: string;
}

interface Success {
	[USERNAME]?: string;
}

interface ValidationResult {
	errors: Errors;
	success: Success;
}

const inputs = [USERNAME]

function validate(formData: FormData): ValidationResult {
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
	const [isLoginLoading, setIsLoginLoading] = React.useState(false)

	async function handleFormSubmit(formData: FormData): Promise<void> {
		setIsLoginLoading(true)

		try {
			const response = await fetch(`/api/login?username=${formData['Nazwa Użytkownika']}`)
			const { user } = await response.json()

			if (user._id) {
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

export default Login
