import React from 'react';
import ReactDOM from 'react-dom';

import APIGUI from './APIGUI';

export default function main({portletNamespace, contextPath, portletElementId, configuration}) {
	ReactDOM.render(
		<APIGUI 
			portletNamespace={portletNamespace}
			contextPath={contextPath}
			portletElementId={portletElementId}
			configuration={configuration}
			/>, 
		document.getElementById(portletElementId)
	); 
}