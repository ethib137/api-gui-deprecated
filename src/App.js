import React from 'react';

import ClayAlert from '@clayui/alert';

import APIGUI from './APIGUI';
import {spritemap} from './Icon';

const App = props => {
	const isSignedIn = themeDisplay.isSignedIn();

	return (
		<>
			{isSignedIn &&
				<APIGUI props={props} />
			}
			{!isSignedIn &&
				<ClayAlert displayType="info" spritemap={spritemap} title="Info">
					{'Please login to use the API GUI.'}
				</ClayAlert>
			}
		</>
	);
}

export default App;