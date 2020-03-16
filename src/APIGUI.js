import React, {useEffect, useMemo, useState} from 'react';

import ClayForm, {ClaySelect} from '@clayui/form';
import ClayAlert from '@clayui/alert';

import APIDisplay from './APIDisplay';
import CategoryList from './CategoryList';
import SchemaExplorer from './SchemaExplorer';
import SchemaList from './SchemaList';

import useSearchParams from './hooks/useSearchParams';

import {spritemap} from './Icon';
import fetch from './util/fetch';
import {getBaseURL} from './util/url';

const APIDisplayStyle = {
	height: 'calc(100% - 104px)',
	overflowY: 'scroll'
};

const APIGUI = props => {
	const [apiCategories, setAPICategories] = useState({});
	const [paths, setPaths] = useState();
	const [schemas, setSchemas] = useState();

	const [selectedCategoryKey, setSelectedCategoryKey] = useSearchParams('APIGroup');
	const [path, setPath] = useSearchParams('path');
	const [selectedMethod, setMethod] = useSearchParams('method');
	const [isExploringSchemas, setIsExploringSchemas] = useSearchParams('exploring-schemas', false);

	useEffect(() => {
		if (paths && path) {
			setMethod(Object.keys(paths[path])[0])
		}
	},[path]);

	const categoryURL = apiCategories && selectedCategoryKey && apiCategories[selectedCategoryKey] ? apiCategories[selectedCategoryKey][0] : '';

	useEffect(() => {
		fetch('/o/openapi', 'get', {}).then(
			res => {
				var categories = {};

				Object.keys(res).map(key => {
					categories[key] = res[key].map(url => url.replace('openapi.yaml', 'openapi.json'));
				});

				if (!selectedCategoryKey) {
					setSelectedCategoryKey(Object.keys(categories)[0])
				}

				setAPICategories(categories);
			}
		);
	}, []);

	useEffect(() => {
		if (selectedCategoryKey && apiCategories[selectedCategoryKey]) {
			fetch(apiCategories[selectedCategoryKey], 'get', {}).then(
				categoryData => {
					setPaths(categoryData.paths);

					setSchemas(categoryData.components.schemas);
				}
			);
		}
	}, [selectedCategoryKey, apiCategories])

	return (
		<div className="api-gui-root">
			<div className="container container-fluid">
				<div className="row">
					<div className="col col-md-5 border p-0 overflow-auto vh-100">
						<ClayForm.Group className="px-3 pt-3">
							<label className="d-flex justify-content-between" htmlFor="categorySelect">
								<span>{'Select API Category'}</span>								

								{schemas &&
									<a
										href="javascript:;"
										onClick={() => {
											setIsExploringSchemas(!isExploringSchemas);
										}}
									>
										{isExploringSchemas ? 'Hide Schemas' : 'Show Schemas'}
									</a>
								}
							</label>
							<ClaySelect
								aria-label="Select API Category"
								onChange={e => {
									setPath();
									setSelectedCategoryKey(e.currentTarget.value);
								}}
								value={selectedCategoryKey}
							>
								{Object.keys(apiCategories).map(key => (
									<ClaySelect.Option
										key={key}
										label={key}
										value={key}
									/>
								))}
							</ClaySelect>
						</ClayForm.Group>

						<div className="api-list border-top p-3" style={APIDisplayStyle}>
							{paths &&
								<CategoryList
									baseURL={selectedCategoryKey}
									curPath={path}
									onClick={(path) => setPath(path)}
									paths={paths}
								/>
							}
						</div>
					</div>

					<div className="col col-md-7 border p-3 overflow-auto vh-100">
						{path && paths && paths[path][selectedMethod] && !isExploringSchemas &&
							<APIDisplay
								baseURL={getBaseURL(categoryURL)}
								path={path}
								pathData={paths[path]}
								selectedMethod={selectedMethod}
								setMethod={setMethod}
							/>
						}

						{!path && 
							<ClayAlert displayType="info" spritemap={spritemap} title="Info">
								{'Please select an API from the list on the left.'}
							</ClayAlert>
						}

						{isExploringSchemas && schemas &&
							<SchemaExplorer category={selectedCategoryKey} schemas={schemas} />
						}
					</div>

					{false && paths && paths[path][selectedMethod] && schemas &&
						<div className="col col-md-2 border p-3 overflow-auto vh-100">
							<SchemaList methodData={paths[path][selectedMethod]} schemas={schemas} />
						</div>
					}
				</div>
			</div>
		</div>
	);
}

export default APIGUI;