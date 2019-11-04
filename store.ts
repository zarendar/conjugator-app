import { createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

export const initialState = {
	progress: {},
	verbs: [],
	verbsCount: 0,
	user: {},
}

const reducer = (state = initialState, action) => {
	switch (action.type) {
	case 'GET_VERBS':
		return {
			...state,
			verbs: action.payload
		}
	case 'GET_VERBS_COUNT':
		return {
			...state,
			verbsCount: action.payload
		}
	case 'GET_PROGRESS':
		return {
			...state,
			progress: action.payload
		}
	case 'LOGIN':
		return {
			...state,
			user: action.payload
		}
	case 'LOGOUT':
		return {
			...state,
			user: {}
		}
	case 'UPDATE_PROGRESS':
		return {
			...state,
			progress: action.payload
		}
	default:
		return state
	}
}

export const initializeStore = (preloadedState = initialState) => {
	return createStore(
		reducer,
		preloadedState,
		composeWithDevTools(applyMiddleware())
	)
}