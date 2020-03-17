export const isObject = (tempVar) => {
	return typeof tempVar === 'object' && tempVar !== null;
}

const REQUEST_BODY_TYPES = [
	'application/json',
	'multipart/form-data'
];

export const getSchemaType = (requestBody) => {
	let schemaType = '';

	if (requestBody) {
		const {content} = requestBody;

		let schema = {};

		REQUEST_BODY_TYPES.forEach(type => {
			if (content[type]) {
				schema = content[type].schema;
			}
		});

		if (schema['$ref']) {
			schemaType = schema['$ref'].replace('#/components/schemas/', '');
		}
		else {
			schemaType = schema.type;
		}
	}

	return schemaType;
}

export const stringify = json => {
	return JSON.stringify(json, null, 4);
}