import {useState, useCallback} from 'react';

import {getSearchParam, setSearchParam} from '../util/params';

export default function useSearchParams(key, initialValue) {
	const [value, setValue] = useState(getSearchParam(key) || initialValue);

	const setParam = useCallback(
		newValue => {
			setValue(newValue);

			setSearchParam(key, newValue);
		},
		[key]
	);

	return [value, setParam];
}