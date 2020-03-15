import React from 'react';

import ResponseDisplay from './ResponseDisplay';

const SchemaList = ({methodData, schemas}) => {
	const getSchema = (key, requestBody, schemas) => {
		let schemaName = methodData.requestBody[key]['application/json'].schema['$ref'] || '';

		schemaName = schemaName.replace('#/components/schemas/', '');

		return schemas[schemaName]
	}

	return (
		<>
			{methodData.requestBody && Object.keys(methodData.requestBody).map(key => (
				<ResponseDisplay key={key} response={getSchema(key, methodData.requestBody, schemas)} />
			))}
		</>
	);
}

export default SchemaList;