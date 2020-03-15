import React from 'react';

import ClayPanel from '@clayui/panel';

import {spritemap} from './Icon';

const style = {
	overflow: 'visible',
	tabSize: 4
};

const SchemaDisplay = ({name, schema}) => {
	return (
		<ClayPanel
			className="schema-display-root"
			collapsable
			displayTitle={name}
			displayType="secondary"
			showCollapseIcon={true}
			spritemap={spritemap}
		>
			<ClayPanel.Body className="overflow-auto">
				<pre style={style}>{JSON.stringify(schema, null, 4)}</pre>
			</ClayPanel.Body>
		</ClayPanel>
	);
}

export default SchemaDisplay;