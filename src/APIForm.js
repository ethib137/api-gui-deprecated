import React, {useEffect} from 'react';

import ClayForm, {ClayInput} from '@clayui/form';
import ClayButton from '@clayui/button';
import {withFormik} from 'formik';

import Icon from './Icon';
import CFErrorMessage from './form/CFErrorMessage';

import fetch from './util/fetch';
import {generateKey, getLocalStorage, setLocalStorage} from './util/storage';
import {getURL} from './util/url';

const APIForm = props => {
	const {
		baseURL,
		errors,
		handleBlur,
		handleChange,
		handleSubmit,
		methodData,
		path,
		isSubmitting,
		touched,
		values,
	} = props;

	const {operationId, parameters} = methodData;

	useEffect(() => {
		setLocalStorage(generateKey(operationId), values);
	}, [values])

	const url = getURL({baseURL, path, params: parameters, values});

	return (
		<form onSubmit={handleSubmit}>
			{parameters && parameters.map(({name, required, schema}) => (
				<ClayForm.Group
					className={errors[name] && touched[name] ? 'has-error' : ''}
					key={name}
				>
					<label htmlFor={name}>
						{name}
						{!!required && 
							<Icon className="reference-mark" symbol="asterisk" />
						}
					</label>

					<div className="input-group">
						<ClayInput
							name={name}
							type="text"
							onChange={handleChange}
							onBlur={handleBlur}
							value={values[name]}
						/>

						<span className="input-group-addon">{schema.type}</span>
					</div>

					<CFErrorMessage name={name} />
				</ClayForm.Group>
			))}

			<ClayForm.Group className="mt-5">
				<label htmlFor="url">{'URL'}</label>

				<ClayInput.Group>
					<ClayInput.GroupItem prepend>
						<ClayInput 
							disabled
							name="url"
							type="text"
							value={url}
						/>
					</ClayInput.GroupItem>
					<ClayInput.GroupItem append shrink>
						<ClayButton disabled={isSubmitting} displayType="primary" type="submit">
							{'Execute'}
						</ClayButton>
					</ClayInput.GroupItem>
				</ClayInput.Group>
			</ClayForm.Group>
		</form>
	);
};

const formikAPIForm = withFormik({
	mapPropsToValues: props => {
		const {operationId, parameters} = props.methodData;

		const initialValues = {};

		const storedValues = getLocalStorage(generateKey(operationId));

		parameters.forEach(({name}) => {
			initialValues[name] = storedValues[name] || '';
		});

		return initialValues;
	},
	validate: (values, props) => {
		const errors = {};

		props.methodData.parameters.forEach(({name, required}) => {
			if (!!required && !values[name]) {
				errors[name] = 'Required';
			}
		});

		return errors;
	},
	handleSubmit: (values, {props, setSubmitting}) => {
		const {
			baseURL,
			method,
			methodData,
			path,
			setResponse,
			setAPIURL
		} = props;

		const url = getURL({
			baseURL,
			path,
			params: methodData.parameters,
			values
		});

		setAPIURL(url);

		fetch(url, method).then(res => {
			setResponse(res);
			setSubmitting(false);
		});
	},
	displayName: 'APIForm',
})(APIForm);

export default formikAPIForm;