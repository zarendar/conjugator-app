// @flow
import { useRouter } from 'next/router'
import cookie from 'js-cookie'
import React from 'react'
import fetch from 'unfetch'
import isEmpty from 'lodash.isempty'

import Form from '../components/form'

interface FormData extends Record<string, string> {
	'Nazwa Użytkownika': string;
}

interface Errors {
	'Nazwa Użytkownika'?: string;
}

const inputs = ['Nazwa Użytkownika']

const initialFormData = { 'Nazwa Użytkownika': '' }

function validate(fromData: FormData): Errors {
	return fromData['Nazwa Użytkownika'] ? {} : {'Nazwa Użytkownika': 'Wymagana jest nazwa użytkownika'}
}

function Login(): JSX.Element {
	const router = useRouter()

	const [isLoginLoading, setIsLoginLoading] = React.useState(false)
	const [formData, setFormData] = React.useState<FormData>(initialFormData)
	const [errors, setErrors] = React.useState({})

	function emitLogin() {
		setIsLoginLoading(true)

		fetch(`/api/login?username=${formData['Nazwa Użytkownika']}`)
			.then(r => r.json())
			.then(({user}) => {
				setIsLoginLoading(false)
				console.log(user)

				if (user._id) {
					cookie.set('token', formData['Nazwa Użytkownika'])
					router.push('/')
				}
			})
			.catch(() => {
				setIsLoginLoading(false)
			})
	}

	function handleFormSubmit() {
		const result = validate(formData)
		setErrors(result)

		if (isEmpty(result)) {
			emitLogin()
		}
	}

	function handleFormChange(event) {
		setFormData({
			...formData,
			[event.target.name]: event.target.value,
		})
		setErrors({
			...errors,
			[event.target.name]: null,
		})
	}

	return (
		<Form
			title={'Zaloguj się'}
			inputs={inputs}
			formData={formData}
			errors={errors}
			success={{}}
			isSubmitting={isLoginLoading}
			submitButtonText={'Zatwierdź'}
			onFormChange={handleFormChange}
			onFormSubmit={handleFormSubmit}
		/>
	)
}

export default Login
