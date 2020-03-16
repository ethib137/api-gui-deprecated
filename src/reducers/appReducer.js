import {getSearchParam} from '../util/params';

const initialState = {
	apiResponse: undefined,
	apiURL: '',
	categoryKey: getSearchParam('category'),
	categories: undefined,
	path: getSearchParam('path'),
	paths: undefined,
	method: getSearchParam('method'),
	schemas: undefined,
	showSchemas: getSearchParam('show-schemas') || false
};

const appStateReducer = (state, action) => {
	switch (action.type) {
		case 'LOAD_API_RESPONSE': {
			return {
				...state,
				apiResponse: action.response
			};
		}
		case 'LOAD_CATEGORIES': {
			const {categories} = action;

			return {
				...state,
				categoryKey: state.categoryKey || Object.keys(categories)[0],
				categories
			};
		}
		case 'LOAD_CATEGORY': {
			const {category} = action;

			const {components, paths} = category;

			return {
				...state,
				paths: paths,
				method: state.method || undefined,
				schemas: components.schemas
			};
		}
		case 'SELECT_CATEGORY': {
			return {
				...state,
				categoryKey: action.categoryKey,
				method: undefined,
				path: undefined
			};
		}
		case 'SELECT_METHOD': {
			return {
				...state,
				method: action.method
			};
		}
		case 'SELECT_PATH': {
			const {path} = action;

			return {
				...state,
				method: Object.keys(state.paths[path])[0],
				path
			};
		}
		case 'SET_API_URL': {
			return {
				...state,
				apiURL: action.url
			};
		}
		case 'TOGGLE_SCHEMAS': {
			return {
				...state,
				showSchemas: !state.showSchemas
			};
		}
		default:
			return state;
	}
}

export {initialState}

export default appStateReducer;
