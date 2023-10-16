import {configureStore} from '@reduxjs/toolkit';
import rootReducer from './reducers';

import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {name as appName} from '../../app.json';

const persistConfig = {
  key: 'root',
  whitelist: [
    'chatReducer',
    'userReducer',
    'profileReducer',
    'NewOnBoardingReducer',
  ],
  keyPrefix: appName,
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false,
      }),
  });
  let persistor = persistStore(store, [{manualPersist: true}]);
  return {store, persistor};
};
