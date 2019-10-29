// @flow
import React from 'react'
import { useRouter } from 'next/router'
import fetch from 'unfetch'
import isEmpty from 'lodash.isempty'
import uniq from 'lodash.uniq'

import {Block} from 'baseui/block'
import {Spinner} from 'baseui/spinner'
import { H5 } from 'baseui/typography'

import Layout from '../components/layout'
import Form from '../components/form'

function validate(fromData, conjugation) {
	const errors = {}
	const success = {}

	for (const i in conjugation) {
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
	const [checked, setChecked] = React.useState([])

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

	React.useEffect(() => {
		setChecked(JSON.parse(localStorage.getItem('checked')) || [])
	}, [])

	React.useEffect(() => {
		if (verb) {
			// emitVerbsSearch(verb)

			setFormData({})
			setErrors({})
			setSuccess({})

			emitConjugation(verb)
		}
	}, [verb])

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

		if (isEmpty(result.errors)) {
			const updatedChecked = uniq([...checked, verb])

			setChecked(updatedChecked)
			localStorage.setItem('checked', JSON.stringify(updatedChecked))
		}
	}

	return (
		<Layout>
			{isConjugationLoading && <Spinner />}
			{verb && !isConjugationLoading && (
				<React.Fragment>
					<H5 marginTop={'scale600'} marginBottom={'scale800'}>
						Bezokolicznik: <strong>{verb}</strong> (
						<Block as={'span'} color={'mono800'}>
							{translate}
						</Block>
						)
					</H5>
					<Form
						checked={checked.includes(verb)}
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
