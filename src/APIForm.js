import React, {useEffect, useMemo} from 'react';

import ClayForm, {ClayInput} from '@clayui/form';
import ClayButton from '@clayui/button';
import {withFormik} from 'formik';
import get from 'lodash.get';

import CFInput from './form/CFInput';
import fetch from './util/fetch';
import Icon from './Icon';
import {generateKey, getLocalStorage, setLocalStorage} from './util/storage';
import {getBaseURL, getCategoryURL} from './util/url';
import {getSchema} from './util/util';
import {getURL} from './util/url';
import {useAppState} from './hooks/appState';

const schemaIterator = (schemaObj, iterator) => {
	if (schemaObj) {
		const {properties, required = []} = schemaObj;

		return Object.keys(properties).map(name => {
			const property = properties[name];

			if (!property.readOnly && !property['$ref']) {
				return iterator({
					defaultVal: property.default,
					name,
					required: required.includes(name),
					type: property.type
				});
			}
		});
	}
}

const getContentType = requestBody => (
	get(requestBody, 'content.multipart/form-data')
		? 'multipart/form-data'
		: get(requestBody, 'content.application/json')
			? 'application/json'
			: null
);

const APIForm = props => {
	const [state, dispatch] = useAppState();

	const {
		apiURL,
		categories,
		categoryKey,
		path,
		schemas,
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

	const contentType = useMemo(() => getContentType(requestBody), [requestBody]);

	const schemaName = getSchema(requestBody);

	const schemaObj = get(schemas, schemaName);

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
			<div className="sheet-section">
				{parameters &&
					<h3 className="sheet-subtitle">{'Parameters'}</h3>
				}

				{parameters && parameters.map(({name, required, schema}) => (
					<CFInput key={name} name={name} required={required} schema={schema.type} />
				))}

				{requestBody &&
					<h3 className="sheet-subtitle">{`Request Body (${contentType})`}</h3>
				}

				{schemaName == 'object' &&
					<CFInput component="textarea" name="jsonObject" required={false} schema={schemaName} />
				}

				{schemaIterator(schemaObj, ({defaultVal, name, required, type}) => (
					<CFInput key={name} name={name} placeholder={defaultVal} required={required} schema={type} />
				))}

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
			</div>
		</form>
	);
};

const formikAPIForm = withFormik({
	mapPropsToValues: ({methodData, schemas}) => {
		const {operationId, parameters, requestBody} = methodData;

		const initialValues = {};

		const storedValues = getLocalStorage(generateKey(operationId));

		if (parameters) {
			parameters.forEach(({name}) => {
				initialValues[name] = storedValues[name] || '';
			});
		}

		const schemaName = getSchema(requestBody);

		const schemaObj = get(schemas, schemaName);

		schemaIterator(schemaObj, ({defaultVal, name}) => {
			initialValues[name] = storedValues[name] || '';
		});

		if (requestBody) {
			initialValues['bodyContent'] = storedValues['bodyContent'] || '';
		}

		return initialValues;
	},
	validate: (values, {methodData, schemas}) => {
		const errors = {};

		methodData.parameters.forEach(({name, required}) => {
			if (!!required && !values[name]) {
				errors[name] = 'Required';
			}
		});

		const schemaName = getSchema(methodData.requestBody);

		const schemaObj = get(schemas, schemaName);

		schemaIterator(schemaObj, ({name, required}) => {
			if (!!required && !values[name]) {
				errors[name] = 'Required';
			}
		});

		return errors;
	},
	handleSubmit: (values, {props, setSubmitting}) => {
		const {
			apiURL,
			method,
			methodData,
			onResponse,
			schemas
		} = props;

		const data = {};

		const {requestBody} = methodData;

		if (requestBody) {
			const schemaName = getSchema(methodData.requestBody);

			const schemaObj = get(schemas, schemaName);

			schemaIterator(schemaObj, ({name}) => {
				if (values[name] && values[name].length > 0) {
					data[name] = values[name];
				}
			});
		}

		const contentType = getContentType(requestBody);

		fetch(apiURL, method, data, contentType).then(res => {
			onResponse({
				contentType,
				data,
				response: res
			})

			setSubmitting(false);
		});
	},
	displayName: 'APIForm',
})(APIForm);

export default formikAPIForm;