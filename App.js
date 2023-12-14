import React, { useEffect, useState } from "react";
import { LogBox } from "react-native";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { enableFreeze, enableScreens } from "react-native-screens";
import * as Sentry from "@sentry/react-native";
import { withIAPContext } from "react-native-iap";
import { useSelector } from "react-redux";

import SocketProvider from "./src/context/SocketContext";
import StackNavigations from "./src/Navigations/StackNavigation";
import configureStore from "./src/store";
import OneSignal from "react-native-onesignal";
import ConnectyCube from "react-native-connectycube";
import CallService from "./src/services/call-service";
import pushNotificationService from "./src/services/PushNotificationService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import messaging from "@react-native-firebase/messaging";
import Toast from "react-native-toast-message";

enableFreeze();
enableScreens();

LogBox.ignoreAllLogs();

Sentry.init({
  dsn: "https://a3d1de0d9f9b4f028cf02bfe934bc868@o4504494817345536.ingest.sentry.io/4504497048322048",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  ignoreErrors: ["Non-Error exception captured"],
});

const { store } = configureStore();
CallService.getStore(store);
pushNotificationService.getStore(store);

const checkToken = async () => {
  let login = await AsyncStorage.getItem("login");
  let cred = await AsyncStorage.getItem("cred");

  if (login != null && cred != null) {
    cred = await JSON.parse(cred);
    // createConnectyCubeSession(cred, login);
  }
};

const createConnectyCubeSession = () => {
  const CREDENTIALS = {
    appId: 6703,
    authKey: "7eQODLX7ZG2eSxZ",
    authSecret: "RLAjfBYRt9gSFfs",
  };
  const CONFIG = {
    debug: { mode: 1 },
  };

  ConnectyCube.init(CREDENTIALS, CONFIG);

  // const userCredentials = {
  //   login: login,
  //   password: "12345678",
  // };

  // ConnectyCube.createSession(userCredentials)
  //   .then(session => {
  //     ConnectyCube.chat
  //       .connect({
  //         userId: session.id,
  //         password: session.token,
  //       })
  //       .then(() => {
  //         CallService.init();
  //         pushNotificationService.init();
  //       })
  //       .catch(error => {
  //         console.log("error: ", error);
  //       });
  //   })
  //   .catch(err => console.log("createSession err:", err));
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
  const navigationRef = createNavigationContainerRef();
  const { mobileNumber, email } = useSelector(store => store.userReducer);

  const [isOpened, setIsOpened] = useState(false);

  OneSignal.setAppId("04e507aa-792a-45f8-9d6d-55859c8dbd92");
  OneSignal.setLogLevel(6, 0);

  //Prompt for push on iOS
  OneSignal.promptForPushNotificationsWithUserResponse(res => {
    console.log("Prompt response:", res);
  });

  //Method for handling notifications received while app in foreground
  OneSignal.setNotificationWillShowInForegroundHandler(
    notificationReceivedEvent => {
      let notification = notificationReceivedEvent.getNotification();
      console.log("notification", JSON.stringify(notification, null, 2));
      // Complete with null means don't show a notification.
      notificationReceivedEvent.complete(notification);
    }
  );

  //Method for handling notifications opened
  OneSignal.setNotificationOpenedHandler(notification => {
    console.log("OneSignal: notification opened:", notification);
    if (mobileNumber || email) {
      console.log("in if 0");
      if (notification.notification.body.includes("received")) {
        console.log("in if 1");
        navigate("BottomTab");
      }
    }

    setIsOpened(true);
  });

  const navigate = name => {
    if (navigationRef.isReady()) {
      setTimeout(() => {
        navigationRef.navigate(name, {
          screen: "Interactions",
        });
      }, 3300);
    }
  };

  useEffect(() => {
    requestUserPermission();
    notificationListener();
    // checkToken();
    createConnectyCubeSession();
  }, []);

  return (
    <SocketProvider>
      <NavigationContainer ref={navigationRef}>
        <StackNavigations />
        <Toast />
      </NavigationContainer>
    </SocketProvider>
  );
};

// export default Sentry.wrap(App);
export default withIAPContext(App);
