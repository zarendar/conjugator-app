// @flow
import React from 'react'
import {compose} from 'redux'
import { useSelector, useDispatch } from 'react-redux'
import { NextPageContext } from 'next'
import { useRouter } from 'next/router'
import fetch from 'isomorphic-unfetch'
import uniq from 'lodash.uniq'
import cookie from 'js-cookie'

import {Block} from 'baseui/block'
import { H5 } from 'baseui/typography'

import Layout from '../components/layout'
import Form from '../components/form'

import getHost from '../utils/get-host'
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

const inputsPresent = [
	{ name: 'ja' },
	{ name: 'ty' },
	{ name: 'on/ona/ono' },
	{ name: 'my' },
	{ name: 'wy' },
	{ name: 'oni/one' }
]

const inputsPast = [
	{ name: 'ja (m)' },
	{ name: 'ja (f)' },
	{ name: 'ty (m)' },
	{ name: 'ty (f)' },
	{ name: 'on' },
	{ name: 'ona' },
	{ name: 'ono' },
	{ name: 'my (m)' },
	{ name: 'my (f)' },
	{ name: 'wy (m)' },
	{ name: 'wy (f)' },
	{ name: 'oni' },
	{ name: 'one' },
]

function validate(formData, tense) {
	const errors = {}
	const success = {}

	for (const i in tense) {
		const currentInput = formData[i] && formData[i].trim().toLowerCase()
		if (currentInput !== tense[i]) {
			errors[i] = tense[i]
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
	const progress = useSelector(state => state.progress)
	const dispatch = useDispatch()

	const [isProgressUpdatingLoading, setProgressUpdatingLoading] = React.useState(false)

	const { verb } = router.query
	const {present = [], past = []} = progress

	async function updateProgress(tense: string): Promise<void> {
		const checked = progress[tense] || []
		const updatedChecked = uniq([...checked, verb])
		const token = cookie.get('token')

		if (token) {
			setProgressUpdatingLoading(true)

			try {
				await fetch('/api/update-progress', {
					method: 'PUT',
					body: JSON.stringify({[tense]: updatedChecked}),
					headers: {
						'Authorization': cookie.get('token'),
						'Content-Type': 'application/json'
					}
				})

				setProgressUpdatingLoading(false)

				dispatch({
					type: 'PROGRESS',
					payload: {
						...progress,
						[tense]: updatedChecked
					}
				})
			} catch (error) {
				setProgressUpdatingLoading(false)
			}
		}
	}

	return (
		<Layout>
			<H5 marginTop={'scale600'} marginBottom={'scale800'}>
						Bezokolicznik: <strong>{verb}</strong> (
				<Block as={'span'} color={'mono800'}>
					{translate}
				</Block>
						)
			</H5>
			<Form
				id={String(verb)}
				title={'Czas teraźniejszy'}
				inputs={inputsPresent}
				isSubmitting={isProgressUpdatingLoading}
				submitButtonText={'Sprawdź'}
				validation={formData => validate(formData, conjugation.present)}
				onFormSubmit={(): Promise<void> => updateProgress('present')}

				checked={present.includes(verb)}
			/>
			{
				present.includes(verb) && (
					<Form
						id={String(verb)}
						title={'Czas przeszły'}
						inputs={inputsPast}
						isSubmitting={isProgressUpdatingLoading}
						submitButtonText={'Sprawdź'}
						validation={formData => validate(formData, conjugation.past)}
						onFormSubmit={(): Promise<void> => updateProgress('past')}

						checked={past.includes(verb)}
					/>
				)
			}
		</Layout>
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


export default compose(withRedux, withAuth)(Conjugate)
