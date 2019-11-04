// @flow
import React from 'react'
import {Block} from 'baseui/block'
import {H6} from 'baseui/typography'
import {FormControl} from 'baseui/form-control'
import {Input} from 'baseui/input'
import { Button } from 'baseui/button'
import { Card } from 'baseui/card'
import { Check } from 'baseui/icon'

interface Props {
	title: string;
	inputs: string[];
	formData: Record<string, string>;
	errors: Record<string, string>;
	isSubmitting: boolean;
	submitButtonText: string;
	onFormChange: any;
	onFormSubmit: any;

	checked?: boolean;
	success: Record<string, boolean>;
}

export default function Form({
	title,
	inputs,
	checked,
	formData,
	errors,
	success,
	isSubmitting,
	submitButtonText,
	onFormChange,
	onFormSubmit,
}: Props): JSX.Element{
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
						{submitButtonText}
					</Button>
				</Block>
			</Card>
		</Block>
	)
}
