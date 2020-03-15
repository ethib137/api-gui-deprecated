import React from 'react';

import SchemaDisplay from './SchemaDisplay';

const style = {
	lineHeight: '1em'
};

const SchemaExplorer = ({category, schemas}) => {
	return (
		<div className="schema-explorer-root">
			<div className="align-items-end d-flex justify-content-between mb-2">
				<h1 style={style}>{'Schemas:'}</h1>

				<h3 style={style}><em>{category}</em></h3>
			</div>

			{Object.keys(schemas).map(key => (
				<SchemaDisplay key={key} name={key} schema={schemas[key]} />
			))}
		</div>
	);
}

export default SchemaExplorer;