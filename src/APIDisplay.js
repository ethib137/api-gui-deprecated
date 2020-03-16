import React, {useEffect, useState} from 'react';

import ClayTabs from '@clayui/tabs';

import APIForm from './APIForm';
import JavascriptExample from './JavascriptExample';
import MethodBadge from './MethodBadge';
import ResponseDisplay from './ResponseDisplay';
import {useAppState} from './hooks/appState';

const badgeStyle = {
	outline: 'none'
};

const APIDisplay = () => {
	const [state, dispatch] = useAppState();

	const {
		apiResponse,
		apiURL,
		method,
		path,
		paths
	} = state;

	const [tabIndex, setTabIndex] = useState(0);

	const pathData = paths[path];

	const methodData = pathData[method];

	const tabs = [
		['Result', <ResponseDisplay response={apiResponse} />],
		['Javascript Example', <JavascriptExample method={method} url={apiURL} />]
	];

	return (
		<div>
			<h1>{path}</h1>

			<div className="align-items-center d-flex mb-4">
				{Object.keys(pathData).map(key => (
					<button
						className="btn-unstyled d-flex mr-2 text-light"
						key={key}
						onClick={() => {
							dispatch({
								method: key,
								type: 'SELECT_METHOD'
							})
						}}
						style={badgeStyle}
					>
						<MethodBadge className={'flex-shrink-0'} displayType={key != method ? 'secondary' : null} method={key} />
					</button>
				))}
			</div>

			{methodData.description &&
				<p>{methodData.description}</p>
			}

			<APIForm
				methodData={methodData}
				apiURL={apiURL}
				method={method}
				onResponse={response => {
					dispatch({
						type: 'LOAD_API_RESPONSE',
						response
					});
				}}
			/>

			{apiResponse &&
				<>
					<ClayTabs>
						{tabs.map((tab, i) => (
							<ClayTabs.Item
								active={tabIndex == i}
								innerProps={{
									"aria-controls": `tabpanel-${i + 1}`
								}}
								key={i}
								onClick={() => setTabIndex(i)}
							>
								{tab[0]}
							</ClayTabs.Item>
						))}
					</ClayTabs>

					<ClayTabs.Content activeIndex={tabIndex}>
						{tabs.map((tab, i) => (
							<ClayTabs.TabPane aria-labelledby={`tab-${i + 1}`} key={i}>
								{tab[1]}
							</ClayTabs.TabPane>
						))}
					</ClayTabs.Content>
				</>
			}
		</div>
	);
}

export default APIDisplay;