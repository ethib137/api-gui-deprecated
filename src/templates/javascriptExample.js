export default javascriptExample = (method, url) => (
`const method = '${method}';

const request = {
	method: method
};

if (method === 'POST') {
	const body = JSON.stringify(data);

	request.body = body;

	const headers = new Headers();

	headers.append('Content-Type', 'application/json');

	request.headers = headers;
}

Liferay.Util.fetch(
	'${url}',
	request
).then(
	res => res.json()
).then(res => {
	console.log('res', res);
});`
)