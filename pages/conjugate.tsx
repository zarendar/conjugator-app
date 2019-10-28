// @flow
import React from 'react'
import {Block} from 'baseui/block'
import {Spinner} from 'baseui/spinner'
import {H5} from 'baseui/typography'
import fetch from 'unfetch'
import { useRouter } from 'next/router'

import Layout from '../components/layout'
import Form from '../components/form'

function validate(fromData, conjugation) {
	const errors = {}
	const success = {}

	for (let i in conjugation) {
		const currentInput = fromData[i] && fromData[i].toLowerCase()
		if (currentInput !== conjugation[i]) {
			errors[i] = conjugation[i]
		} else {
			success[i] = true
		}
	}

	return {
		errors,
		success,
	}
}

function Conjugate() {
	const router = useRouter()
	const { verb } = router.query

	const [conjugation, setConjugation] = React.useState({})
	const [translate, setTranslate] = React.useState('')
	const [
		isConjugationLoading,
		setIsConjugationLoading,
	] = React.useState(false)
	const [formData, setFormData] = React.useState({})
	const [errors, setErrors] = React.useState({})
	const [success, setSuccess] = React.useState({})

	React.useEffect(() => {
		if (verb) {
			// emitVerbsSearch(verb)

			setFormData({})
			setErrors({})
			setSuccess({})

			emitConjugation(verb)
		}
	}, [verb])

	function emitConjugation(query) {
		setIsConjugationLoading(true)

		fetch(`/api/conjugation?q=${query}`)
			.then(r => r.json())
			.then((data) => {
				setIsConjugationLoading(false)
				setConjugation(data.conjugation)
				setTranslate(data.translate)
			})
			.catch(() => {
				setIsConjugationLoading(false)
			})
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
		setSuccess({
			...errors,
			[event.target.name]: null,
		})
	}

	function handleFormSubmit() {
		const result = validate(formData, conjugation)
		setErrors(result.errors)
		setSuccess(result.success)
	}

	return (
		<Layout>
			{isConjugationLoading && <Spinner />}
			{verb && !isConjugationLoading && (
				<React.Fragment>
					<H5 marginTop={'scale300'} marginBottom={'scale600'}>
						Bezokolicznik: <strong>{verb}</strong> (
						<Block as={'span'} color={'mono800'}>
							{translate}
						</Block>
						)
					</H5>
					<Form
						formData={formData}
						errors={errors}
						success={success}
						isSubmitting={isConjugationLoading}
						onFormChange={handleFormChange}
						onFormSubmit={handleFormSubmit}
					/>
				</React.Fragment>
			)}
		</Layout>
	)
}

export default Conjugate
