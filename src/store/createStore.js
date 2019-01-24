import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducer from '../reducers'
import { createLogger } from 'redux-logger'

const log = createLogger({ diff: true, collapsed: true});

export default(initialState = {}) => {

	const middlerware = [thunk, log];
	const enhancers = [];

	const store = createStore(
		reducer(),
		initialState,
		compose(
			applyMiddleware(...middlerware,...enhancers)
		)
	)

	return store;
}