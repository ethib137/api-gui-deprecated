import React, {useEffect} from 'react';

import ClayForm, {ClayInput} from '@clayui/form';
import ClayButton from '@clayui/button';
import {withFormik} from 'formik';

import Icon from './Icon';
import CFInput from './form/CFInput';

import fetch from './util/fetch';
import {getSchema} from './util/util';
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

	const {operationId, parameters, requestBody} = methodData;

	useEffect(() => {
		setLocalStorage(generateKey(operationId), values);
	}, [values])

	const url = getURL({baseURL, path, params: parameters, values});

	return (
		<form onSubmit={handleSubmit}>
			{parameters && parameters.map(({name, required, schema}) => (
				<CFInput key={name} name={name} required={required} schema={schema.type} />
			))}

			{requestBody &&
				<CFInput component="textarea" name="bodyContent" required={false} schema={getSchema(requestBody)} />
			}

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
		const {operationId, parameters, requestBody} = props.methodData;

		const initialValues = {};

		const storedValues = getLocalStorage(generateKey(operationId));

		parameters.forEach(({name}) => {
			initialValues[name] = storedValues[name] || '';
		});

		if (requestBody) {
			initialValues['bodyContent'] = storedValues['bodyContent'] || '';
		}

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

		fetch(url, method, values.bodyContent).then(res => {
			setResponse(res);
			setSubmitting(false);
		});
	},
	displayName: 'APIForm',
})(APIForm);

export default formikAPIForm;