import { createStore, applyMiddleware  } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import {createLogger} from 'redux-logger';
import rootReducer from '../reducers';

const loggerMiddleware = createLogger();

const createStoreWithMiddleware = applyMiddleware(
	loggerMiddleware,  // redux-logger
)(createStore);

const persistConfig = {
	key: 'root',
	storage,
	keyPrefix: '',
	blacklist: ['StateReducer']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
let store = createStoreWithMiddleware(persistedReducer);
let persistor = persistStore(store);

module.exports = {
	store, 
	persistor
};