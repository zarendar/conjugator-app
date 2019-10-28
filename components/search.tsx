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
			clearable={false}
			isLoading={isOptionsLoading}
			options={searchOptions}
			placeholder="verb"
			maxDropdownHeight="300px"
			type={TYPE.search}
			value={searchValue}
			onChange={onSearchChange}
			onInputChange={onSearchInputChange}
		/>
	)
}

export default Search
