export const getBaseURL = categoryURL => {
	return categoryURL.replace('/v1.0/openapi.json', '');
}

export const getSearchParams = (params, values) => {
	var searchParams = new URLSearchParams();

	params.forEach(function (param) {
		if (param.in == 'query') {
			searchParams.set(param.name, values[param.name]);
		}
	});

	return searchParams.toString();
};

export const getURL = ({baseURL, path, params, values}) => {
	return `${baseURL}${replaceParams(path, params, values)}?${getSearchParams(params, values)}`;
};

export const replaceParams = (path, params, values) => {
	params.forEach(param => {
		if (param.in == 'path') {
			path = path.replace(`{${param.name}}`, values[param.name]);
		}
	});

	return path;
};