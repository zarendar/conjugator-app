import React from 'react'
import { useRouter } from 'next/router'
import { Select, TYPE } from 'baseui/select'
import fetch from 'unfetch'

function fromVerbToOption(verb: string) {
  return {
    id: verb,
    label: verb,
  };
}

function Search() {
	const router = useRouter()
  const {verb} = router.query

  const [
		isVerbsLoading,
		setIsVerbsLoadingLoading,
  ] = React.useState(false)
  const [verbs, setVerbs] = React.useState([])

  React.useEffect(() => {
		if (verb) {
			emitVerbsSearch(verb)
		}
	}, [verb])

  function handleInputSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
		emitVerbsSearch(event.target.value)
	}

	function handleSearchChange({option}: any) {
		router.push(`/conjugate?verb=${option.id}`)
  }

  function emitVerbsSearch(query) {
		setIsVerbsLoadingLoading(true)

		fetch(`/api/search?q=${query}`)
			.then(r => r.json())
			.then((data) => {
				setIsVerbsLoadingLoading(false)
				setVerbs(data)
			})
			.catch(() => {
				setIsVerbsLoadingLoading(false)
			})
	}

	const value: any = verb ? [{ id: verb }] : null;

	return (
		<Select
			clearable={false}
			isLoading={isVerbsLoading}
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
