import React, {useEffect, useState} from 'react';

import ClayTabs from '@clayui/tabs';

import useSearchParams from './hooks/useSearchParams';

import APIForm from './APIForm';
import JavascriptExample from './JavascriptExample';
import MethodBadge from './MethodBadge';
import ResponseDisplay from './ResponseDisplay';

const APIDisplay = ({baseURL, path, pathData, selectedMethod, setMethod}) => {
	const [apiURL, setAPIURL] = useState('');
	const [response, setResponse] = useState();
	const [tabIndex, setTabIndex] = useState(0);

	const methodData = pathData[selectedMethod];

	const tabs = [
		['Result', <ResponseDisplay response={response} />],
		['Javascript Example', <JavascriptExample method={selectedMethod} url={apiURL} />]
	];

	return (
		<div>
			<h1>{path} <MethodBadge method={selectedMethod} /></h1>

			<div className="align-items-center d-flex">
				{Object.keys(pathData).map(method => (
					<button className="btn-unstyled d-flex text-light" key={method} onClick={() => setMethod(method)}>
						<MethodBadge className={'flex-shrink-0'} displayType={method != selectedMethod ? 'secondary' : null} method={method} />
					</button>
				))}
			</div>

			{methodData.description &&
				<p>{methodData.description}</p>
			}

			{methodData &&
				<APIForm
					baseURL={baseURL}
					method={selectedMethod}
					methodData={methodData}
					path={path}
					setAPIURL={setAPIURL}
					setResponse={setResponse}
				/>
			}

			{response &&
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