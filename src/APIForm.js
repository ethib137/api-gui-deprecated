import React, {useMemo} from 'react';

import get from 'lodash.get';

import {getBaseURL, getCategoryURL} from './util/url';
import {getSchemaType} from './util/util';
import {useAppState} from './hooks/appState';

import APIFormBase from './APIFormBase';

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
		categories,
		categoryKey,
		method,
		path,
		paths,
		schemas,
	} = state;

	const methodData = paths[path][method];

	const {operationId, requestBody} = methodData;

	const schema = schemas[getSchemaType(requestBody)];

	const baseURL = getBaseURL(getCategoryURL(categories, categoryKey))

	const contentType = useMemo(() => getContentType(requestBody), [requestBody]);

	return (
		<APIFormBase
			baseURL={baseURL}
			contentType={contentType}
			key={operationId}
			method={method}
			methodData={methodData}
			onResponse={({apiURL, data, response}) => {
				dispatch({
					apiURL,
					contentType,
					data,
					response,
					type: 'LOAD_API_RESPONSE'
				});
			}}
			path={path}
			schema={schema}
		/>
	);
};

export default APIForm;