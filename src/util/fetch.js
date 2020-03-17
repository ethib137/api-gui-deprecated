const fetch = (url, method = 'get', data, contentType) => {
	const request = {
		method: method.toUpperCase()
	};

	if (method === 'post' || method === 'put') {
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

	return Liferay.Util.fetch(
		url,
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
	);
}

export default fetch;