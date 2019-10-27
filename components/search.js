// @flow
import React from 'react';
import {Select, TYPE} from 'baseui/select';

const Search = ({
  searchOptions,
  searchValue,
  onSearchChange,
  onSearchInputChange,
}) => {
  return (
    <Select
      options={searchOptions}
      placeholder="verb"
      maxDropdownHeight="300px"
      type={TYPE.search}
      onChange={onSearchChange}
      onInputChange={onSearchInputChange}
      value={searchValue ? {id: searchValue} : null}
    />
  );
};

export default Search;
