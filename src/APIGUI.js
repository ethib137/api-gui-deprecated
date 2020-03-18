import React, {useEffect, useMemo, useState} from 'react';

import ClayForm, {ClayInput, ClaySelect} from '@clayui/form';
import ClayAlert from '@clayui/alert';

import APIDisplay from './APIDisplay';
import PathList from './PathList';
import fetch from './util/fetch';
import SchemaExplorer from './SchemaExplorer';
import {getCategoryURL} from './util/url';
import {setSearchParam} from './util/params';
import {spritemap} from './Icon';
import {useAppState} from './hooks/appState';

const APIDisplayStyle = {
	height: 'calc(100% - 190px)',
	overflowY: 'scroll'
};

const APIGUI = props => {
	const [state, dispatch] = useAppState();

	const {
		categoryKey,
		categories,
		filter,
		method,
		path,
		paths,
		schemas,
		showSchemas
	} = state;

	useEffect(() => {
		setSearchParam('category', categoryKey);
	}, [categoryKey]);

	useEffect(() => {
		setSearchParam('path', path);
	}, [path]);

	useEffect(() => {
		setSearchParam('method', method);
	}, [method]);

	useEffect(() => {
		setSearchParam('filter', filter);
	}, [filter]);

	useEffect(() => {
		setSearchParam('show-schemas', showSchemas);
	}, [showSchemas]);

	useEffect(() => {
		let current = true;

		fetch('/o/openapi', 'get', {}).then(
			res => {
				if (current) {
					var categories = {};

					Object.keys(res).map(key => {
						categories[key] = res[key].map(url => url.replace('openapi.yaml', 'openapi.json'));
					});

					dispatch({
						type: 'LOAD_CATEGORIES',
						categories
					});
				}
			}
		);

		return () => (current = false);
	}, []);

	useEffect(() => {
		let current = true;

		const categoryURL = getCategoryURL(categories, categoryKey);

		if (categoryURL) {
			fetch(categoryURL).then(
				category => {
					if (current) {
						dispatch({
							type: 'LOAD_CATEGORY',
							category
						});
					}
				}
			);
		}

		return () => (current = false);
	}, [categoryKey, categories])

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
											dispatch({
												type: 'TOGGLE_SCHEMAS'
											});
										}}
									>
										{showSchemas ? 'Hide Schemas' : 'Show Schemas'}
									</a>
								}
							</label>
							<ClaySelect
								aria-label="Select API Category"
								onChange={e => {
									dispatch({
										type: 'SELECT_CATEGORY',
										categoryKey: e.currentTarget.value
									});
								}}
								value={categoryKey}
							>
								{categories && Object.keys(categories).map(key => (
									<ClaySelect.Option
										key={key}
										label={key}
										value={key}
									/>
								))}
							</ClaySelect>
						</ClayForm.Group>

						<ClayForm.Group className="px-3 pt-0">
							<label htmlFor="filter">{'Filter'}</label>

							<ClayInput
								name="filter"
								type="text"
								onChange={event => {
									dispatch({
										filter: event.target.value,
										type: 'SET_FILTER'
									})
								}}
								value={filter}
							/>
						</ClayForm.Group>

						<div className="api-list border-top p-3" style={APIDisplayStyle}>
							{paths &&
								<PathList
									baseURL={categoryKey}
									curPath={path}
									filter={filter}
									onClick={selPath => {
										dispatch({
											path: selPath,
											type: 'SELECT_PATH'
										});
									}}
									paths={paths}
								/>
							}
						</div>
					</div>

					<div className="col col-md-7 border p-3 overflow-auto vh-100">
						{paths && path && method && !showSchemas &&
							<APIDisplay />
						}

						{!path && 
							<ClayAlert displayType="info" spritemap={spritemap} title="Info">
								{'Please select an API from the list on the left.'}
							</ClayAlert>
						}

						{showSchemas && schemas &&
							<SchemaExplorer category={categoryKey} schemas={schemas} />
						}
					</div>
				</div>
			</div>
		</div>
	);
}

export default APIGUI;