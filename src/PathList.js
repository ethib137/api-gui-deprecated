import React, {useEffect, useRef} from 'react';

const PathList = props => {
	const {
		baseURL,
		curPath,
		filter,
		onClick,
		paths
	} = props;

	const selectedPathEl = useRef(null);

	useEffect(() => {
		if (selectedPathEl && selectedPathEl.current) {
			selectedPathEl.current.scrollIntoView();

			window.scroll(0, 0);
		}
	}, []);

	let pathKeys = Object.keys(paths);

	if (filter.trim().length > 0) {
		pathKeys = pathKeys.filter(pathkey => pathkey.toLowerCase().includes(filter.toLowerCase()));
	}

	return (
		<>
			{pathKeys.map(path => (
				<button
					className={`btn btn-block ${path == curPath ? 'btn-primary' : 'btn-secondary'} mb-3 text-left`}
					key={path}
					onClick={() => onClick(path)}
					ref={path == curPath ? selectedPathEl : null}
					type="button"
				>
					{path}
				</button>
			))}
		</>
	);
}

export default PathList;