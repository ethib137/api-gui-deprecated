export const isObject = (tempVar) => {
	return typeof tempVar === 'object' && tempVar !== null;
}

export const getSchema = (requestBody) => {
	let schema = '';

	const schemaObj = requestBody.content['application/json'].schema;

	if (schemaObj['$ref']) {
		schema = schemaObj['$ref'].replace('#/components/schemas/', '');
	}
	else {
		schema = schemaObj.type;
	}

	return schema;
}