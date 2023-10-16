import React, {useEffect} from 'react';
import {LogBox} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {enableFreeze, enableScreens} from 'react-native-screens';
import * as Sentry from '@sentry/react-native';
import {withIAPContext} from 'react-native-iap';

import SocketProvider from './src/context/SocketContext';
import StackNavigations from './src/Navigations/StackNavigation';
import configureStore from './src/store';
import OneSignal from 'react-native-onesignal';
import ConnectyCube from 'react-native-connectycube';
import CallService from './src/services/call-service';
import pushNotificationService from './src/services/PushNotificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';

enableFreeze();
enableScreens();

LogBox.ignoreAllLogs();

Sentry.init({
  dsn: 'https://a3d1de0d9f9b4f028cf02bfe934bc868@o4504494817345536.ingest.sentry.io/4504497048322048',
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  ignoreErrors: ['Non-Error exception captured'],
});

const {store, persistor} = configureStore();
CallService.getStore(store);
pushNotificationService.getStore(store);
persistor.persist();

OneSignal.setAppId('04e507aa-792a-45f8-9d6d-55859c8dbd92');
OneSignal.setLogLevel(6, 0);

//Prompt for push on iOS
OneSignal.promptForPushNotificationsWithUserResponse(res => {
  console.log('Prompt response:', res);
});

//Method for handling notifications received while app in foreground
OneSignal.setNotificationWillShowInForegroundHandler(
  notificationReceivedEvent => {
    let notification = notificationReceivedEvent.getNotification();

    // Complete with null means don't show a notification.
    notificationReceivedEvent.complete(notification);
  },
);

//Method for handling notifications opened
OneSignal.setNotificationOpenedHandler(notification => {
  console.log('OneSignal: notification opened:', notification);
});

const checkToken = async () => {
  let login = await AsyncStorage.getItem('login');
  let cred = await AsyncStorage.getItem('cred');

  if (login != null && cred != null) {
    cred = await JSON.parse(cred);
    createConnectyCubeSession(cred, login);
  }
};

const createConnectyCubeSession = (cred, login) => {
  const CREDENTIALS = {
    appId: cred?.appid,
    authKey: cred?.authKey,
    authSecret: cred?.authSec,
  };
  const CONFIG = {
    debug: {mode: 0},
  };

  ConnectyCube.init(CREDENTIALS, CONFIG);

  const userCredentials = {
    login: login,
    password: '12345678',
  };

  ConnectyCube.createSession(userCredentials)
    .then(session => {
      ConnectyCube.chat
        .connect({
          userId: session.id,
          password: session.token,
        })
        .then(() => {
          CallService.init();
          pushNotificationService.init();
        })
        .catch(error => {
          console.log('error: ', error);
        });
    })
    .catch(err => console.log('createSession err:', err));
};

const requestUserPermission = async () => {
  await messaging().requestPermission();
  await messaging().getToken();
};

const notificationListener = async () => {
  messaging().onNotificationOpenedApp(() => {});

  messaging().onMessage(async () => {});

  messaging()
    .getInitialNotification()
    .then(() => {});
};

const App = () => {
  useEffect(() => {
    requestUserPermission();
    notificationListener();
    checkToken();
  }, []);

  return (
    <SocketProvider>
      <NavigationContainer>
        <StackNavigations />
        <Toast />
      </NavigationContainer>
    </SocketProvider>
  );
};

// export default Sentry.wrap(App);
export default Sentry.wrap(withIAPContext(App));
