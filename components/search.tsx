import React from 'react'
import { useRouter } from 'next/router'
import { Select, TYPE } from 'baseui/select'
import fetch from 'unfetch'
import debounce from 'lodash.debounce'
import isEmpty from 'lodash.isempty'

function fromVerbToOption(verb: {word: string}) {
	return {
		id: verb.word,
		label: verb.word,
	}
}

function Search() {
	const router = useRouter()
	const {verb} = router.query

	const [isVerbsLoading, setIsVerbsLoadingLoading] = React.useState(false)
	const [verbs, setVerbs] = React.useState([])

	function emitVerbsSearch(query) {
		if (isEmpty(query)) {
			return setVerbs([])
		}

		setIsVerbsLoadingLoading(true)

		fetch(`/api/verbs?search=${query}`)
			.then(r => r.json())
			.then(({verbs}) => {
				setIsVerbsLoadingLoading(false)
				setVerbs(verbs)
			})
			.catch(() => {
				setIsVerbsLoadingLoading(false)
			})
	}

	const debounceLoadData = React.useCallback(debounce(emitVerbsSearch, 500), [])

	React.useEffect(() => {
		if (verb) {
			emitVerbsSearch(verb)
		}
	}, [verb])

	function handleInputSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
		debounceLoadData(event.target.value)
	}

	function handleSearchChange({option}: any) {
		router.push(`/conjugate?verb=${option.id}`)
	}

	const value: any = verb ? [{ id: verb }] : null

	return (
		<Select
			clearable={false}
			isLoading={isVerbsLoading}
			openOnClick={false}
			options={verbs.map(fromVerbToOption)}
			placeholder="verb"
			maxDropdownHeight="300px"
			type={TYPE.search}
			value={value}
			onChange={handleSearchChange}
			onInputChange={handleInputSearchChange}
		/>
	)
}

export default Search
