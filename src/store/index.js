import AsyncStorage from '@react-native-community/async-storage';
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import rootReducer from '../reducers';

const persistConfig = {
	key: 'root',
	storage: AsyncStorage,
	keyPrefix: '',
	blacklist: ['StateReducer']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);
let store = createStore(persistedReducer);
let persistor = persistStore(store);

module.exports = {
	store, 
	persistor
};