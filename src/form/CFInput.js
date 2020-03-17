import React from 'react';

import {connect, getIn} from 'formik';

import ClayForm, {ClayInput} from '@clayui/form';

import Icon from '../Icon';
import CFErrorMessage from './CFErrorMessage';

const CFInput = props => {
	const {
		component,
		formik,
		name,
		required,
		type,
		...otherProps
	} = props;

	const {
		errors,
		handleChange,
		handleBlur,
		touched,
		values
	} = formik;

	const error = getIn(errors, name);
	const touch = getIn(touched, name);

	return (
		<ClayForm.Group
			className={error && touch ? 'has-error' : ''}
			key={name}
		>
			<label htmlFor={name}>
				{name}
				{!!required && 
					<Icon className="reference-mark" symbol="asterisk" />
				}
			</label>

			<ClayInput.Group>
				<ClayInput.GroupItem prepend>
					<ClayInput
						component={component}
						name={name}
						type="text"
						onChange={handleChange}
						onBlur={handleBlur}
						value={values[name]}
						{...otherProps}
					/>
				</ClayInput.GroupItem>
				<ClayInput.GroupItem append shrink>
					<ClayInput.GroupText className="h-100">{type}</ClayInput.GroupText>
				</ClayInput.GroupItem>
			</ClayInput.Group>

			<CFErrorMessage name={name} />
		</ClayForm.Group>
	);
}

export default connect(CFInput);