export const isObject = (tempVar) => {
	return typeof tempVar === 'object' && tempVar !== null;
}

const REQUEST_BODY_TYPES = [
	'application/json',
	'multipart/form-data'
];

export const getSchema = (requestBody) => {
	let schema = '';

	if (requestBody) {
		const {content} = requestBody;

		let schemaObj = {};

		REQUEST_BODY_TYPES.forEach(type => {
			if (content[type]) {
				schemaObj = content[type].schema;
			}
		});

		if (schemaObj['$ref']) {
			schema = schemaObj['$ref'].replace('#/components/schemas/', '');
		}
		else {
			schema = schemaObj.type;
		}
	}

	return schema;
}

export const stringify = json => {
	return JSON.stringify(json, null, 4);
}