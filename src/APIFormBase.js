import React, {useEffect} from 'react';

import ClayForm, {ClayInput} from '@clayui/form';
import ClayButton from '@clayui/button';
import {withFormik} from 'formik';
import get from 'lodash.get';

import CFInput from './form/CFInput';
import fetch from './util/fetch';
import {generateKey, getLocalStorage, setLocalStorage} from './util/storage';
import {getSchemaType} from './util/util';
import {getURL} from './util/url';

const schemaIterator = (schema, iterator) => {
	if (schema) {
		const {properties, required = []} = schema;

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

const APIFormBase = props => {
	const {
		contentType,
		handleSubmit,
		isSubmitting,
		methodData,
		schema,
		values
	} = props;

	const {operationId, parameters, requestBody} = methodData;

	const schemaType = getSchemaType(requestBody);

	useEffect(() => {
		setLocalStorage(generateKey(operationId), values);
	}, [operationId, values]);

	return (
		<form onSubmit={handleSubmit}>
			<div className="sheet-section">
				{parameters &&
					<h3 className="sheet-subtitle">{'Parameters'}</h3>
				}

				{parameters && parameters.map(({name, required, schema}) => (
					<CFInput key={name} name={name} required={required} type={schema.type} />
				))}

				{requestBody &&
					<h3 className="sheet-subtitle">{`Request Body (${contentType}: ${schemaType})`}</h3>
				}

				{schemaType == 'object' &&
					<CFInput component="textarea" name="jsonObject" required={false} type={schemaType} />
				}

				{schemaIterator(schema, ({defaultVal, name, required, type}) => (
					<CFInput key={name} name={name} placeholder={defaultVal} required={required} type={type} />
				))}

				<ClayForm.Group className="mt-5">
					<ClayButton
						className="btn-block"
						disabled={isSubmitting}
						displayType="primary"
						type="submit"
					>
						{'Execute'}
					</ClayButton>
				</ClayForm.Group>
			</div>
		</form>
	);
};

const formikAPIForm = withFormik({
	mapPropsToValues: ({methodData, schema}) => {
		const {operationId, parameters, requestBody} = methodData;

		const initialValues = {};

		const storedValues = getLocalStorage(generateKey(operationId));

		if (parameters) {
			parameters.forEach(({name}) => {
				initialValues[name] = storedValues[name] || '';
			});
		}

		schemaIterator(schema, ({defaultVal, name}) => {
			initialValues[name] = storedValues[name] || '';
		});

		return initialValues;
	},
	validate: (values, {methodData, schema}) => {
		const errors = {};

		methodData.parameters.forEach(({name, required}) => {
			if (!!required && !values[name]) {
				errors[name] = 'Required';
			}
		});

		schemaIterator(schema, ({name, required}) => {
			if (!!required && !values[name]) {
				errors[name] = 'Required';
			}
		});

		return errors;
	},
	handleSubmit: (values, {props, setSubmitting}) => {
		const {
			baseURL,
			contentType,
			method,
			methodData,
			onResponse,
			path,
			schema
		} = props

		const data = {};

		const {parameters, requestBody} = methodData;

		if (requestBody) {
			schemaIterator(schema, ({name}) => {
				if (values[name] && values[name].length > 0) {
					data[name] = values[name];
				}
			});
		}

		const apiURL = getURL({baseURL, path, params: parameters, values})

		fetch(apiURL, method, data, contentType).then(response => {
			onResponse({
				apiURL,
				data,
				response
			})

			setSubmitting(false);
		});
	},
	displayName: 'APIFormBase',
})(APIFormBase);

export default formikAPIForm;