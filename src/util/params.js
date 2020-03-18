const setSearchParamsWithoutPageReload = qs => {
	const newurl = `${location.protocol}//${location.host}${location.pathname}?${qs}`;

	history.pushState({ path: newurl }, "", newurl);
};

export const setSearchParam = (key, value) => {
	const searchParams = new URLSearchParams(location.search);

	if (value && value.length > 0) {
		searchParams.set(key, value);
	}
	else {
		searchParams.delete(key);
	}

	setSearchParamsWithoutPageReload(searchParams.toString());
}

export const getSearchParams = () => {
	const newSearchParams = {};

	const searchParams = new URLSearchParams(location.search);

	searchParams.forEach(
		(value, key) => {
			newSearchParams[key] = value;
		}
	);

	return newSearchParams;
}

export const getSearchParam = key => {
	const searchParams = new URLSearchParams(location.search);

	return searchParams.get(key) || null;
}