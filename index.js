import "react-native-gesture-handler";
import "react-native-get-random-values";

/**
 * @format
 */
import React from "react";
import { AppRegistry } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { name as appName } from "./app.json";

import configureStore from "./src/store";
import App from "./App";

const { store, persistor } = configureStore();
persistor.persist();

const ReduxWrapper = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => ReduxWrapper);
