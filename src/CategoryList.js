import React, {useEffect, useRef} from 'react';

const CategoryList = ({baseURL, curPath, onClick, paths}) => {
	const selectedCategoryEl = useRef(null);

	useEffect(() => {
		if (selectedCategoryEl && selectedCategoryEl.current) {
			selectedCategoryEl.current.scrollIntoView();

			window.scroll(0, 0);
		}
	}, []);

	return (
		<>
			{Object.keys(paths).map(path => (
				<button
					className={`btn btn-block ${path == curPath ? 'btn-primary' : 'btn-secondary'} mb-3 text-left`}
					key={path}
					onClick={() => onClick(path)}
					ref={path == curPath ? selectedCategoryEl : null}
					type="button"
				>
					{path}
				</button>
			))}
		</>
	);
}

export default CategoryList;