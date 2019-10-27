// @flow
import React from 'react';
import {Block} from 'baseui/block';
import {H6} from 'baseui/typography';
import {FormControl} from 'baseui/form-control';
import {Input} from 'baseui/input';
import {Button} from 'baseui/button';

const inputs = ['ja', 'ty', 'on/ona/ono', 'my', 'wy', 'oni/one'];

export default function Form({
  formData,
  errors,
  success,
  isSubmitting,
  onFormChange,
  onFormSubmit,
}) {
  return (
    <div>
      <H6>Czas teraźniejszy</H6>
      {inputs.map(input => (
        <FormControl key={input} label={input}>
          <Input
            disabled={isSubmitting}
            name={input}
            error={Boolean(errors[input])}
            positive={success[input]}
            value={formData[input]}
            onChange={onFormChange}
          />
        </FormControl>
      ))}
      <Block display={'flex'} justifyContent={'flex-end'}>
        <Button isLoading={isSubmitting} onClick={onFormSubmit}>
          Check
        </Button>
      </Block>
    </div>
  );
}
