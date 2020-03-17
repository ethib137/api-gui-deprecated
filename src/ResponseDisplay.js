import React from 'react';

import {stringify} from './util/util';

const style = {
	overflow: 'visible',
	tabSize: 4
};

const ResponseDisplay = (props) => {
	const {response, ...otherProps} = props;

	return (
		<div className="card overflow-auto vh-100">
			<div className="p-3">
				<pre style={style} {...otherProps}>{stringify(response)}</pre>
			</div>
		</div>
	);
}

export default ResponseDisplay;