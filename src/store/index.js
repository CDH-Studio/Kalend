import { createStore, applyMiddleware  } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import {createLogger} from 'redux-logger';
import AsyncStorage from '@react-native-community/async-storage';
import rootReducer from '../reducers';

const loggerMiddleware = createLogger({
	collapsed: true
});

const createStoreWithMiddleware = applyMiddleware(
	loggerMiddleware,  // redux-logger
)(createStore);

const persistConfig = {
	key: 'root',
	storage: AsyncStorage,
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