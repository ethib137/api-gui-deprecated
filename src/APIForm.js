import React, {useEffect} from 'react';

import ClayForm, {ClayInput} from '@clayui/form';
import ClayButton from '@clayui/button';
import {withFormik} from 'formik';

import CFInput from './form/CFInput';
import fetch from './util/fetch';
import Icon from './Icon';
import {generateKey, getLocalStorage, setLocalStorage} from './util/storage';
import {getBaseURL, getCategoryURL} from './util/url';
import {getSchema} from './util/util';
import {getURL} from './util/url';
import {useAppState} from './hooks/appState';

const APIForm = props => {
	const [state, dispatch] = useAppState();

	const {
		apiURL,
		categories,
		categoryKey,
		path
	} = state;

	const {
		errors,
		handleBlur,
		handleChange,
		handleSubmit,
		isSubmitting,
		methodData,
		touched,
		values,
	} = props;

	const {operationId, parameters, requestBody} = methodData;

	useEffect(() => {
		setLocalStorage(generateKey(operationId), values);
	}, [operationId, values]);

	useEffect(() => {
		const categoryURL = getCategoryURL(categories, categoryKey);

		const baseURL = getBaseURL(categoryURL)

		dispatch({
			type: 'SET_API_URL',
			url: getURL({baseURL, path, params: parameters, values})
		});
	}, [path, parameters, values])

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
							value={apiURL}
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
		const {apiURL, method, onResponse} = props

		fetch(apiURL, method, values.bodyContent).then(res => {
			onResponse(res)

			setSubmitting(false);
		});
	},
	displayName: 'APIForm',
})(APIForm);

export default formikAPIForm;