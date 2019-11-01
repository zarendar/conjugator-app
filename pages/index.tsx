import React from 'react'
import Link from 'next/link'

import { ListItem, ListItemLabel } from 'baseui/list'
import { Spinner } from 'baseui/spinner'
import { useStyletron } from 'baseui'
import { StyledLink } from 'baseui/link'
import { Check } from 'baseui/icon'
import { Label2 } from 'baseui/typography'
import { Block } from 'baseui/block'

import Layout from '../components/layout'

function Index() {
	const [useCss] = useStyletron()
	const [list, setList] = React.useState([])
	const [isListLoading, setIsListLoading] = React.useState(false)
	const [checked, setChecked] = React.useState([])

	React.useEffect(() => {
		setIsListLoading(true)
		setChecked(JSON.parse(localStorage.getItem('checked')) || [])

		fetch('/api/verbs')
			.then(r => r.json())
			.then(({verbs}) => {
				setIsListLoading(false)
				setList(verbs)
			})
			.catch((e) => {
				setIsListLoading(false)
				console.log(e)
			})
	}, [])

	return (
		<Layout>
			<ul
				className={useCss({
					paddingLeft: 0,
					paddingRight: 0,
					marginTop: 0,
				})}
			>
				{list.length > 0 && (
					<Block display={'flex'} justifyContent={'flex-end'} alignItems={'center'}>
						<Check size={32}/>
						<Label2 marginTop={0} marginBottom={0}>{checked.length}/{list.length}</Label2>
					</Block>
				)}
				{isListLoading ? <Spinner/> : list.map(item => (
					<Link key={item._id} href={`/conjugate?verb=${item.word}`}>
						<StyledLink href={`/conjugate?verb=${item.word}`}>
							<ListItem endEnhancer={() => checked.includes(item.word) ? <Check size={24} /> : null}>
								<ListItemLabel>{item.word}</ListItemLabel>
							</ListItem>
						</StyledLink>
					</Link>
				))}
			</ul>
		</Layout>
	)
}

export default Index
