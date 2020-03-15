import React from 'react';

const style = {
	overflow: 'visible',
	tabSize: 4
};

const ResponseDisplay = (props) => {
	const {response, ...otherProps} = props;

	return (
		<div className="card overflow-auto vh-100">
			<div className="p-3">
				<pre style={style} {...otherProps}>{JSON.stringify(response, null, 4)}</pre>
			</div>
		</div>
	);
}

export default ResponseDisplay;