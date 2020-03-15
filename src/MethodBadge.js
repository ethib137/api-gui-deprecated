import React from 'react';

import ClayBadge from '@clayui/badge';

const METHOD_DISPLAY_MAP = {
	'post': 'success',
	'get': 'primary',
	'put': 'warning',
	'patch': 'info',
	'delete': 'danger'
}

export default function(props) {
	const {displayType, method, ...otherProps} = props;

	return (
		<ClayBadge
			displayType={displayType || METHOD_DISPLAY_MAP[method]}
			label={method.toUpperCase()}
			{...otherProps}
		/>
	);
}