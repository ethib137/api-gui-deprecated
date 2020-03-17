export const getCategoryURL = (categories, categoryKey) => {
	return categories && categoryKey && categories ? categories[categoryKey][0] : '';
}

export const getBaseURL = categoryURL => {
	return categoryURL.replace('/v1.0/openapi.json', '');
}

export const getSearchParams = (params = [], values) => {
	var searchParams = new URLSearchParams();

	params.forEach(function (param) {
		const value = values[param.name];

		if (param.in == 'query' && value) {
			searchParams.set(param.name, value);
		}
	});

	const paramsString = searchParams.toString();

	return (paramsString.length > 0) ? `?${searchParams.toString()}` : '';
};

export const getURL = ({baseURL, path, params, values}) => {
	return baseURL + replaceParams(path, params, values) + getSearchParams(params, values);
};

export const replaceParams = (path, params, values) => {
	if (params) {
		params.forEach(param => {
			if (param.in == 'path') {
				path = path.replace(`{${param.name}}`, values[param.name]);
			}
		});
	}

	return path;
};