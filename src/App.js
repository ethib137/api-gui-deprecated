import React from 'react';

import ClayAlert from '@clayui/alert';

import APIGUI from './APIGUI';
import appReducer, {initialState} from "./reducers/appReducer";
import {AppStateProvider} from './hooks/appState';
import {spritemap} from './Icon';

const App = props => {
	const isSignedIn = themeDisplay.isSignedIn();

	return (
		<AppStateProvider reducer={appReducer} initialState={initialState}>
			{isSignedIn &&
				<APIGUI props={props} />
			}
			{!isSignedIn &&
				<ClayAlert displayType="info" spritemap={spritemap} title="Info">
					{'Please login to use the API GUI.'}
				</ClayAlert>
			}
		</AppStateProvider>
	);
}

export default App;