import React from 'react';

import {connect, getIn} from 'formik';

const CFErrorMessage = props => {
	const error = getIn(props.formik.errors, props.name);
	const touch = getIn(props.formik.touched, props.name);

	const errorDOM = (
		<div className="form-feedback-group">
			<div className="form-feedback-item">{error}</div>
		</div>
	);

	return touch && error ? errorDOM : null;
};

export default connect(CFErrorMessage);