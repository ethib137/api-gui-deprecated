const METHOD_MAP = {
	'delete': 'DELETE',
	get: 'GET',
	patch: 'PATCH',
	post: 'POST',
	put: 'PUT'
}

const fetch = (url, method, data = {}) => {
	const request = {
		method: METHOD_MAP[method]
	};

	if (method === 'post') {
		const body = JSON.stringify(data);

		request.body = body;

		const headers = new Headers();

		headers.append('Content-Type', 'application/json');

		request.headers = headers;
	}

	return Liferay.Util.fetch(
		url,
		request
	).then(
		res => res.json()
	);
}

export default fetch;