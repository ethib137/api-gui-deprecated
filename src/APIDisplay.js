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
		contentType,
		method,
		path,
		paths,
		requestBodyData,
		schemas
	} = state;

	const [tabIndex, setTabIndex] = useState(0);

	const pathData = paths[path];

	const methodData = pathData[method];

	const tabs = [
		['Response', <ResponseDisplay response={apiResponse} />],
		['Javascript Example', <JavascriptExample contentType={contentType} data={requestBodyData} method={method} url={apiURL} />]
	];

	return (
		<div>
			<div className="mb-2 sheet-header">
				<h2 className="mb-2 sheet-title">{path}</h2>

				<div className="align-items-center d-flex sheet-text">
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
					<div className="sheet-text">{methodData.description}</div>
				}
			</div>

			<APIForm />

			{apiResponse &&
				<div className="sheet-section">
					<h3 className="sheet-subtitle">{'Response'}</h3>

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
				</div>
			}
		</div>
	);
}

export default APIDisplay;