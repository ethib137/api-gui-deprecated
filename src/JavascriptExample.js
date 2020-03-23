import React from 'react';

import javascriptExample from './templates/javascriptExample';

const style = {
	overflow: 'visible',
	tabSize: 4
};

const JavascriptExample = ({contentType, data, method, url}) => {
	return (
		<div className="card overflow-auto vh-100">
			<div className="p-3">
				<pre style={style}>{javascriptExample({contentType, data, method, url})}</pre>
			</div>
		</div>
	);
}

export default JavascriptExample;