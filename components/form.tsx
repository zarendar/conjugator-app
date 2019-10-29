// @flow
import React from 'react'
import {Block} from 'baseui/block'
import {H6} from 'baseui/typography'
import {FormControl} from 'baseui/form-control'
import {Input} from 'baseui/input'
import { Button } from 'baseui/button'
import { Card } from 'baseui/card'
import { Check } from 'baseui/icon'

const inputs = ['ja', 'ty', 'on/ona/ono', 'my', 'wy', 'oni/one']

export default function Form({
	checked,
	formData,
	errors,
	success,
	isSubmitting,
	onFormChange,
	onFormSubmit,
}) {
	return (
		<Card>
			<H6 display={'flex'} alignItems={'center'} marginTop={0} marginBottom={'scale600'}>Czas teraźniejszy {checked && <Check size={32}/>}</H6>
			{inputs.map(input => (
				<FormControl key={input} error={errors[input]} label={input}>
					<Input
						autoComplete={'off'}
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
          Sprawdź
				</Button>
			</Block>
		</Card>
	)
}
