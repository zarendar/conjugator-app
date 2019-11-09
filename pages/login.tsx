// @flow
import { useRouter } from 'next/router'
import Link from 'next/link'
import React from 'react'
import { useDispatch } from 'react-redux'

import cookie from 'js-cookie'
import fetch from 'isomorphic-unfetch'
import isEmpty from 'lodash.isempty'
import  validator from 'validator'

import { toaster } from 'baseui/toast'
import {StyledLink} from 'baseui/link'

import Form from '../components/form'
import { withRedux } from '../utils/redux'

interface ValidationResult {
	errors: Record<string, string>;
	success: Record<string, string>;
}

const USERNAME = 'Nazwa Użytkownika'
const PASSWORD = 'Hasło'

const inputs = [
	{ name: USERNAME },
	{ name: PASSWORD, type: 'password' }
]

function validate(formData: Record<string, string>): ValidationResult {
	const errors = {}
	const success = {}

	if (isEmpty(formData[USERNAME])) {
		errors[USERNAME] = 'Wymagana jest nazwa użytkownika'
	} else if (!validator.isAlphanumeric(formData[USERNAME])) {
		errors[USERNAME] = 'Powinien zawierać tylko litery i cyfry.'
	}



	if (isEmpty(formData[PASSWORD])) {
		errors[PASSWORD] = 'Wymagana jest hasło'
	} else if (formData[PASSWORD].length < 6) {
		errors[PASSWORD] = 'Musi mieć co najmniej 6 znaków'
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
			const response = await fetch('/api/login', {
				method: 'POST',
				body: JSON.stringify({
					username: formData[USERNAME],
					password: formData[PASSWORD]
				}),
				headers: {
					'Content-Type': 'application/json'
				}
			})
			const { error, user, token } = await response.json()

			if (error) {
				setIsLoginLoading(false)
				toaster.warning(error, {})

				return
			}

			if (user._id) {
				dispatch({
					type: 'LOGIN',
					payload: user
				})

				cookie.set('token', token, { expires: 365 })
				router.push('/')
			}
		} catch (error) {
			setIsLoginLoading(false)
		}
	}

	return (
		<>
			<Link href={'/'}>
				<StyledLink
					href={'/'}
					style={{ display: 'block', cursor: 'pointer', marginBottom: '15px' }}
				>
					Lista Czasowników
				</StyledLink>
			</Link>
			<Form
				title={'Zaloguj się'}
				inputs={inputs}
				isSubmitting={isLoginLoading}
				submitButtonText={'Zatwierdź'}
				validation={validate}
				onFormSubmit={handleFormSubmit}
			/>
			<Link href={'/sign-up'}>
				<StyledLink
					href={'/sign-up'}
					style={{ display: 'block', textAlign: 'center', cursor: 'pointer' }}
				>
					Zapisz się
				</StyledLink>
			</Link>
		</>
	)
}

export default withRedux(Login)
