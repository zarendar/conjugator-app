import React from 'react'
import {compose} from 'redux'
import {useSelector} from 'react-redux'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import isEmpty from 'lodash.isempty'
import nextCookie from 'next-cookies'

import { Block } from 'baseui/block'
import { ListItem, ListItemLabel } from 'baseui/list'
import { StyledLink } from 'baseui/link'
import { Check } from 'baseui/icon'
import { Label2 } from 'baseui/typography'

import { withRedux } from '../utils/redux'
import getHost from '../utils/get-host'
import { withAuth } from '../utils/auth'
import { withLayout } from '../utils/layout'

function Index(): JSX.Element {
	const verbs = useSelector(state => state.verbs)
	const progress = useSelector(state => state.progress)

	const present = progress.present || []

	return (
		<>
			<Block
				as={'ul'}
				paddingLeft={0}
				paddingRight={0}
				marginTop={0}
			>
				<Block display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
					<Check size={32}/>
					<Label2 marginTop={0} marginBottom={0}>{present.length}/{verbs.length}</Label2>
				</Block>
				{verbs.map(verb => (
					<Link key={verb._id} href={`/conjugate?verb=${verb.word}`}>
						<StyledLink href={`/conjugate?verb=${verb.word}`}>
							<ListItem endEnhancer={() => present.includes(verb.word) ? <Check size={24} /> : null}>
								<ListItemLabel>{verb.word}</ListItemLabel>
							</ListItem>
						</StyledLink>
					</Link>
				))}
			</Block>
		</>
	)
}

Index.getInitialProps = async (ctx) => {
	const { reduxStore, req } = ctx
	const { token } = nextCookie(ctx)

	if (isEmpty(reduxStore.getState().verbs)) {
		const getVerbsResponse = await fetch(`${getHost(req)}/api/verbs`)
		const { verbs } = await getVerbsResponse.json()

		reduxStore.dispatch({
			type: 'GET_VERBS',
			payload: verbs
		})
	}

	if (isEmpty(reduxStore.getState().progress) && token) {
		const progressResponse = await fetch(`${getHost(req)}/api/progress?username=${token}`)
		const {progress} = await progressResponse.json()

		reduxStore.dispatch({
			type: 'GET_PROGRESS',
			payload: progress
		})
	}

	return {}
}

export default compose(withAuth, withRedux, withLayout)(Index)
