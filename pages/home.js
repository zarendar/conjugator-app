// @flow
import React from 'react';
import {Block} from 'baseui/block';
import {Spinner} from 'baseui/spinner';
import {H5} from 'baseui/typography';
import fetch from 'unfetch';

import Search from '../components/search';
import Form from '../components/form';

function validate(fromData, conjugation) {
  const errors = {};
  const success = {};

  for (let i in conjugation) {
    const currentInput = fromData[i] && fromData[i].toLowerCase();
    if (currentInput !== conjugation[i]) {
      errors[i] = conjugation[i];
    } else {
      success[i] = true;
    }
  }

  return {
    errors,
    success,
  };
}

const fromVerbToOption = verb => ({
  id: verb,
  label: verb,
});

const Home = () => {
  const [verbs, setVerbs] = React.useState([]);
  const [verb, setVerb] = React.useState('');
  const [conjugation, setConjugation] = React.useState({});
  const [translate, setTranslate] = React.useState('');
  const [
    isVerbsLoading,
    setIsVerbsLoadingLoading,
  ] = React.useState(false);
  const [
    isConjugationLoading,
    setIsConjugationLoading,
  ] = React.useState(false);
  const [formData, setFormData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [success, setSuccess] = React.useState({});

  function handleInputSearchChange(event) {
    setIsVerbsLoadingLoading(true)

    fetch(`/api/search?q=${event.target.value}`)
      .then(r => r.json())
      .then((data) => {
        setIsVerbsLoadingLoading(false)
        setVerbs(data);
      })
      .catch(() => {
        setIsVerbsLoadingLoading(false)
      });
  }

  function handleSearchChange({option}) {
    setIsConjugationLoading(true);
    setFormData({});
    setErrors({});
    setSuccess({});

    fetch(`/api/conjugation?q=${option.id}`)
      .then(r => r.json())
      .then((data) => {
        setIsConjugationLoading(false);
        setConjugation(data.conjugation);
        setTranslate(data.translate);
        setVerb(option.id);
      })
      .catch(() => {
        setIsConjugationLoading(false);
      });
  }

  function handleFormChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    setErrors({
      ...errors,
      [event.target.name]: null,
    });
    setSuccess({
      ...errors,
      [event.target.name]: null,
    });
  }

  function handleFormSubmit() {
    const result = validate(formData, conjugation);
    setErrors(result.errors);
    setSuccess(result.success);
  }

  return (
    <Block padding={'scale300'}>
      <Search
        isOptionsLoading={isVerbsLoading}
        searchOptions={verbs.map(fromVerbToOption)}
        searchValue={verb}
        onSearchChange={handleSearchChange}
        onSearchInputChange={handleInputSearchChange}
      />
      <Block paddingTop={'scale300'}>
        {isConjugationLoading && <Spinner />}
        {verb && !isConjugationLoading && (
          <React.Fragment>
            <H5 marginTop={'scale300'} marginBottom={'scale300'}>
              Bezokolicznik: <strong>{verb}</strong> (
              <Block as={'span'} color={'mono800'}>
                {translate}
              </Block>
              )
            </H5>
            <Form
              formData={formData}
              errors={errors}
              success={success}
              isSubmitting={isConjugationLoading}
              onFormChange={handleFormChange}
              onFormSubmit={handleFormSubmit}
            />
          </React.Fragment>
        )}
      </Block>
    </Block>
  );
};

export default Home;
