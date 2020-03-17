import {stringify} from '../util/util';

const stringOrNull = string => {
	return string ? `'${string}'` : null;
}

const javascriptExample = ({contentType, data, method, url}) => (
`const contentType = ${stringOrNull(contentType)};
const data = ${stringify(data)};
const method = '${method.toUpperCase()}';

const request = {
	method: method
};

if (method === 'POST' || method === 'PUT') {
	if (contentType === 'application/json') {
		request.body = JSON.stringify(data);

		const headers = new Headers();

		headers.append('Content-Type', contentType);

		request.headers = headers;
	}
	else if (contentType === 'multipart/form-data') {
		const formData  = new FormData();

		for(const name in data) {
			formData.append(name, data[name]);
		}

		request.body = formData;
	}
}

Liferay.Util.fetch(
	'${url}',
	request
).then(
	res => {
		let retVal;

		if (method == 'delete' && res.status == 204) {
			retVal = 'Deleted Successfully';
		}
		else {
			retVal = res.json();
		}

		return retVal;
	}
).then(res => {
	console.log('res', res);
});`
);

export default javascriptExample;