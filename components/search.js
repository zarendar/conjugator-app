// @flow
import React from 'react'
import {Select, TYPE} from 'baseui/select'

const Search = ({
	isOptionsLoading,
	searchOptions,
	searchValue,
	onSearchChange,
	onSearchInputChange,
}) => {
	return (
		<Select
			isLoading={isOptionsLoading}
			options={searchOptions}
			placeholder="verb"
			maxDropdownHeight="300px"
			type={TYPE.search}
			onChange={onSearchChange}
			onInputChange={onSearchInputChange}
			value={searchValue ? {id: searchValue} : null}
		/>
	)
}

export default Search
