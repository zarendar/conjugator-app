// @flow
import React from 'react'
import {compose} from 'redux'
import {useSelector, useDispatch} from 'react-redux'
import { useRouter } from 'next/router'
import fetch from 'unfetch'
import isEmpty from 'lodash.isempty'
import uniq from 'lodash.uniq'

import {Block} from 'baseui/block'
import {Spinner} from 'baseui/spinner'
import { H5 } from 'baseui/typography'

import Form from '../components/form'

import { withLayout } from '../utils/layout'
import { withRedux } from '../utils/redux'
import { withAuth } from '../utils/auth'

const inputs = ['ja', 'ty', 'on/ona/ono', 'my', 'wy', 'oni/one']
const inputsPast = ['ja (m)', 'ja (f)', 'ty (m)', 'ty (f)', 'on', 'ona', 'ono', 'my (m)', 'my (f)', 'wy (m)', 'wy (f)', 'oni', 'one']

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

function Conjugate(): JSX.Element {
	const router = useRouter()
	const { verb } = router.query

	const progress = useSelector(state => state.progress)
	const dispatch = useDispatch()

	const [translate, setTranslate] = React.useState('')
	const [conjugationPresent, setConjugationPresent] = React.useState({})
	const [conjugationPast, setConjugationPast] = React.useState({})
	const [isConjugationLoading, setIsConjugationLoading] = React.useState(false)
	const [isProgressUpdatingLoading,setProgressUpdatingLoading] = React.useState(false)
	const [formData, setFormData] = React.useState({})
	const [formDataPast, setFormDataPast] = React.useState({})
	const [errors, setErrors] = React.useState({})
	const [errorsPast, setErrorsPast] = React.useState({})
	const [success, setSuccess] = React.useState({})
	const [successPast, setSuccessPast] = React.useState({})
	const [checked, setChecked] = React.useState<any>(progress.present || [])
	const [checkedPast, setCheckedPast] = React.useState<any>(progress.past || [])

	function emitConjugation(query) {
		setIsConjugationLoading(true)

		fetch(`/api/conjugation?q=${query}`)
			.then(r => r.json())
			.then((data) => {
				setTranslate(data.translate)
				setIsConjugationLoading(false)
				setConjugationPresent(data.conjugationPresent)
				setConjugationPast(data.conjugationPast)
			})
			.catch(() => {
				setIsConjugationLoading(false)
			})
	}

	React.useEffect(() => {
		if (verb) {
			setFormData({})
			setFormDataPast({})
			setErrors({})
			setErrorsPast({})
			setSuccess({})
			setSuccessPast({})

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

	function handleFormPastChange(event) {
		setFormDataPast({
			...formDataPast,
			[event.target.name]: event.target.value,
		})
		setErrorsPast({
			...errors,
			[event.target.name]: null,
		})
		setSuccessPast({
			...errors,
			[event.target.name]: null,
		})
	}

	async function handleFormSubmit() {
		const result = validate(formData, conjugationPresent)
		setErrors(result.errors)
		setSuccess(result.success)

		if (isEmpty(result.errors)) {
			const updatedChecked = uniq([...checked, verb])

			setProgressUpdatingLoading(true)

			try {
				await fetch('/api/update-progress', {
					method: 'PUT',
					body: JSON.stringify(updatedChecked),
					headers: {
						'Content-Type': 'application/json'
					}
				})

				setChecked(updatedChecked)
				setProgressUpdatingLoading(false)

				dispatch({
					type: 'UPDATE_PROGRESS',
					payload: {
						...progress,
						present: updatedChecked
					}
				})
			} catch (error) {
				setProgressUpdatingLoading(false)
			}
		}
	}

	async function handleFormPastSubmit() {
		const result = validate(formDataPast, conjugationPast)
		setErrorsPast(result.errors)
		setSuccessPast(result.success)

		if (isEmpty(result.errors)) {
			const updatedChecked = uniq([...checkedPast, verb])

			setProgressUpdatingLoading(true)

			try {
				await fetch('/api/update-progress', {
					method: 'PUT',
					body: JSON.stringify(updatedChecked),
					headers: {
						'Content-Type': 'application/json'
					}
				})

				setCheckedPast(updatedChecked)
				setProgressUpdatingLoading(false)

				dispatch({
					type: 'UPDATE_PROGRESS',
					payload: {
						...progress,
						past: updatedChecked
					}
				})
			} catch (error) {
				setProgressUpdatingLoading(false)
			}
		}
	}

	return (
		<>
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
						title={'Czas teraźniejszy'}
						inputs={inputs}
						checked={checked.includes(verb)}
						formData={formData}
						errors={errors}
						success={success}
						isSubmitting={isConjugationLoading || isProgressUpdatingLoading}
						submitButtonText={'Sprawdź'}
						onFormChange={handleFormChange}
						onFormSubmit={handleFormSubmit}
					/>
					<Form
						title={'Czas przeszły'}
						inputs={inputsPast}
						checked={checkedPast.includes(verb)}
						formData={formDataPast}
						errors={errorsPast}
						success={successPast}
						isSubmitting={isConjugationLoading || isProgressUpdatingLoading}
						submitButtonText={'Sprawdź'}
						onFormChange={handleFormPastChange}
						onFormSubmit={handleFormPastSubmit}
					/>
				</React.Fragment>
			)}
		</>
	)
}

export default compose(withRedux, withAuth, withLayout)(Conjugate)
