// @flow
import React from 'react'
import {compose} from 'redux'
import { useSelector, useDispatch } from 'react-redux'
import { NextPageContext } from 'next'
import { useRouter } from 'next/router'
import fetch from 'isomorphic-unfetch'
import isEmpty from 'lodash.isempty'
import uniq from 'lodash.uniq'

import {Block} from 'baseui/block'
import { H5 } from 'baseui/typography'

import Form from '../components/form'

import getHost from '../utils/get-host'
import { withLayout } from '../utils/layout'
import { withRedux } from '../utils/redux'
import { withAuth } from '../utils/auth'

interface Conjugation {
	word: string;
	present: Record<string, string>;
	past: Record<string, string>;
}

interface Props {
	translate: string;
	conjugation: Conjugation;
}

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

function Conjugate({translate, conjugation}: Props): JSX.Element {
	const router = useRouter()
	const { verb } = router.query

	const progress = useSelector(state => state.progress)
	const dispatch = useDispatch()

	const [isProgressUpdatingLoading,setProgressUpdatingLoading] = React.useState(false)
	const [formData, setFormData] = React.useState({})
	const [formDataPast, setFormDataPast] = React.useState({})
	const [errors, setErrors] = React.useState({})
	const [errorsPast, setErrorsPast] = React.useState({})
	const [success, setSuccess] = React.useState({})
	const [successPast, setSuccessPast] = React.useState({})
	const [checked, setChecked] = React.useState<any>(progress.present || [])
	const [checkedPast, setCheckedPast] = React.useState<any>(progress.past || [])

	React.useEffect(() => {
		if (verb) {
			setFormData({})
			setFormDataPast({})
			setErrors({})
			setErrorsPast({})
			setSuccess({})
			setSuccessPast({})
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
			...success,
			[event.target.name]: null,
		})
	}

	function handleFormPastChange(event) {
		setFormDataPast({
			...formDataPast,
			[event.target.name]: event.target.value,
		})
		setErrorsPast({
			...success,
			[event.target.name]: null,
		})
		setSuccessPast({
			...errors,
			[event.target.name]: null,
		})
	}

	async function handleFormSubmit() {
		const result = validate(formData, conjugation.present)
		setErrors(result.errors)
		setSuccess(result.success)

		if (isEmpty(result.errors)) {
			const updatedChecked = uniq([...checked, verb])

			setProgressUpdatingLoading(true)

			try {
				await fetch('/api/update-progress', {
					method: 'PUT',
					body: JSON.stringify({present: updatedChecked}),
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
		const result = validate(formDataPast, conjugation.past)
		setErrorsPast(result.errors)
		setSuccessPast(result.success)

		if (isEmpty(result.errors)) {
			const updatedChecked = uniq([...checkedPast, verb])

			setProgressUpdatingLoading(true)

			try {
				await fetch('/api/update-progress', {
					method: 'PUT',
					body: JSON.stringify({past: updatedChecked}),
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
				isSubmitting={isProgressUpdatingLoading}
				submitButtonText={'Sprawdź'}
				onFormChange={handleFormChange}
				onFormSubmit={handleFormSubmit}
			/>
			{
				checked.includes(verb) && (
					<Form
						title={'Czas przeszły'}
						inputs={inputsPast}
						checked={checkedPast.includes(verb)}
						formData={formDataPast}
						errors={errorsPast}
						success={successPast}
						isSubmitting={isProgressUpdatingLoading}
						submitButtonText={'Sprawdź'}
						onFormChange={handleFormPastChange}
						onFormSubmit={handleFormPastSubmit}
					/>
				)
			}
		</>
	)
}

Conjugate.getInitialProps = async (ctx: NextPageContext): Promise<Props> => {
	const { req, query } = ctx
	const word = encodeURI(String(query.verb))

	const verbsResponse = await fetch(`${getHost(req)}/api/verbs?search=${word}`)
	const conjugationResponse = await fetch(`${getHost(req)}/api/conjugation?word=${word}`)

	const { verbs } = await verbsResponse.json()
	const { conjugation } = await conjugationResponse.json()

	const [verb] = verbs

	return {
		translate: verb.translate,
		conjugation
	}
}


export default compose(withRedux, withAuth, withLayout)(Conjugate)
