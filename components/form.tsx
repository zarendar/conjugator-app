// @flow
import React from 'react'
import isEmpty from 'lodash.isempty'

import {Block} from 'baseui/block'
import {H6} from 'baseui/typography'
import {FormControl} from 'baseui/form-control'
import {Input} from 'baseui/input'
import { Button, KIND } from 'baseui/button'
import { Card } from 'baseui/card'
import { Check } from 'baseui/icon'

interface Props {
	title: string;
	inputs: {type?: string; name: string}[];
	isSubmitting: boolean;
	submitButtonText: string;
	validation: any;
	onFormSubmit: any;

	checked?: boolean;
}

export default function Form({
	title,
	inputs,
	checked,
	isSubmitting,
	submitButtonText,
	validation,
	onFormSubmit,
}: Props): JSX.Element{
	const [formData, setFormData] = React.useState({})
	const [errors, setErrors] = React.useState({})
	const [success, setSuccess] = React.useState({})

	function handleInputChange(event: React.ChangeEvent<HTMLInputElement>): void {
		const {target: {name, value}} = event

		setFormData({
			...formData,
			[name]: value,
		})
		setErrors({
			...errors,
			[name]: null,
		})
		setSuccess({
			...success,
			[name]: null,
		})
	}

	function handleReset(): void {
		setFormData({})
		setErrors({})
		setSuccess({})
	}

	function handleSubmit(): void {
		const result = validation(formData)

		setErrors(result.errors)
		setSuccess(result.success)

		if (isEmpty(result.errors)) {
			onFormSubmit(formData)
		}
	}

	return (
		<Block marginBottom={'scale800'}>
			<Card>
				<H6
					display={'flex'}
					alignItems={'center'}
					marginTop={0}
					marginBottom={'scale600'}>
					{title} {checked && <Check size={32} />}
				</H6>
				{inputs.map(({type, name}) => (
					<FormControl key={name} error={errors[name]} label={name}>
						<Input
							type={type || 'text'}
							autoComplete={'off'}
							disabled={isSubmitting}
							name={name}
							error={Boolean(errors[name])}
							positive={success[name]}
							value={formData[name] || ''}
							onChange={handleInputChange}
						/>
					</FormControl>
				))}
				<Block display={'flex'} justifyContent={'flex-end'}>
					<Button kind={KIND.minimal} onClick={handleReset}>
						Wyczyść
					</Button>
					<Button isLoading={isSubmitting} onClick={handleSubmit}>
						{submitButtonText}
					</Button>
				</Block>
			</Card>
		</Block>
	)
}
