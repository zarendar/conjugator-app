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
    if (fromData[i] !== conjugation[i]) {
      errors[i] = 'Incorrect';
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
  const [verb, setVerb] = React.useState('być');
  const [conjugation, setConjugation] = React.useState({});
  const [translate, setTranslate] = React.useState('');
  const [
    isConjugationLoading,
    setIsConjugationLoading,
  ] = React.useState(false);
  const [formData, setFormData] = React.useState({});
  const [errors, setErrors] = React.useState({});
  const [success, setSuccess] = React.useState({});

  // React.useEffect(() => {
  //   fetch('http://localhost:4000/')
  //     .then(r => r.json())
  //     .then((data: string[]) => {
  //       console.log(data);
  //       setVerbs(data);
  //     });
  // }, [verb]);

  function handleInputSearchChange(event) {
    fetch(`/api/search?q=${event.target.value}`)
      .then(r => r.json())
      .then((data) => {
        setVerbs(data);
      })
      .catch(() => {
        setIsConjugationLoading(false);
      });
  }

  function handleSearchChange({option}) {
    setIsConjugationLoading(true);
    setFormData({});
    setErrors({});
    setSuccess({});

    fetch(`http://localhost:4000/conjugation?q=${option.id}`)
      .then(r => r.json())
      .then((data) => {
        setIsConjugationLoading(false);
        setConjugation(data.conjugation);
        setTranslate(data.translate);
      });
    setVerb(option.id);
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
    <Block padding={'scale800'}>
      <Search
        searchOptions={verbs.map(fromVerbToOption)}
        searchValue={verb}
        onSearchChange={handleSearchChange}
        onSearchInputChange={handleInputSearchChange}
      />
      <Block paddingTop={'scale600'}>
        {isConjugationLoading && <Spinner />}
        {verb && !isConjugationLoading && (
          <React.Fragment>
            <H5>
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
