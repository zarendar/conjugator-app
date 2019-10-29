import React from 'react'
import { ListItem, ListItemLabel } from 'baseui/list';
import { Spinner } from 'baseui/spinner'
import { useStyletron } from 'baseui'
import { StyledLink } from 'baseui/link';
import Link from 'next/link'

import Layout from '../components/layout'

function Index() {
	const [useCss] = useStyletron();
	const [list, setList] = React.useState([]);
	const [isListLoading, setIsListLoading] = React.useState(false);

	React.useEffect(() => {
		setIsListLoading(true)

		fetch(`/api/top`)
			.then(r => r.json())
			.then((data) => {
				setIsListLoading(false)
				setList(data)
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
				})}
			>
				{isListLoading ? <Spinner/> : list.map(item => (
					<Link key={item} href={`/conjugate?verb=${item}`}>
						<StyledLink href={`/conjugate?verb=${item}`}>
							<ListItem>
								<ListItemLabel>{item}</ListItemLabel>
							</ListItem>
						</StyledLink>
					</Link>
				))}
			</ul>
		</Layout>
	)
}

export default Index
