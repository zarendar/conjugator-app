import React from 'react'
import {compose} from 'redux'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Link from 'next/link'
import fetch from 'isomorphic-unfetch'
import isEmpty from 'lodash.isempty'
import nextCookie from 'next-cookies'

import { Block } from 'baseui/block'
import { ListItem, ListItemLabel } from 'baseui/list'
import { StyledLink } from 'baseui/link'
import { Check } from 'baseui/icon'
import { Label2 } from 'baseui/typography'
import { Pagination } from 'baseui/pagination'

import { withRedux } from '../utils/redux'
import getHost from '../utils/get-host'
import { withAuth } from '../utils/auth'
import { withLayout } from '../utils/layout'

function Index(): JSX.Element {
	const {query, push} = useRouter()
	const verbs = useSelector(state => state.verbs)
	const verbsCount = useSelector(state => state.verbsCount)
	const progress = useSelector(state => state.progress)
	const user = useSelector(state => state.user)

	const present = progress.present || []
	const currentPage = query.page || 1

	const pageChange = ({nextPage}) => {
		push(`/?page=${nextPage}`)
	}

	return (
		<>
			{!isEmpty(user) && <Block display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
				<Check size={32}/>
				<Label2 marginTop={0} marginBottom={0}>{present.length}/{verbsCount}</Label2>
			</Block>}
			<Block
				as={'ul'}
				paddingLeft={0}
				paddingRight={0}
				marginTop={0}
			>
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
			<Block display={'flex'} justifyContent={'center'}>
				<Pagination
					numPages={Math.round(verbsCount / 8)}
					currentPage={Number(currentPage)}
					onPageChange={pageChange}
				/>
			</Block>
		</>
	)
}

Index.getInitialProps = async (ctx) => {
	const { reduxStore, req, query } = ctx
	const { token } = nextCookie(ctx)

	const getVerbsResponse = await fetch(`${getHost(req)}/api/verbs?page=${query.page}`)
	const { verbs } = await getVerbsResponse.json()

	reduxStore.dispatch({
		type: 'GET_VERBS',
		payload: verbs
	})

	if (reduxStore.getState().verbsCount === 0) {
		const getVerbsCountResponse = await fetch(`${getHost(req)}/api/get-verbs-count`)
		const {verbsCount} = await getVerbsCountResponse.json()

		reduxStore.dispatch({
			type: 'GET_VERBS_COUNT',
			payload: verbsCount
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

export default compose(withRedux, withAuth, withLayout)(Index)
