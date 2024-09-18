import React, { useEffect, useRef } from "react";
import { LogBox } from "react-native";
import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native";
import { enableFreeze, enableScreens } from "react-native-screens";
import * as Sentry from "@sentry/react-native";
import { withIAPContext } from "react-native-iap";
import { useSelector } from "react-redux";

import MobileAds from "react-native-google-mobile-ads";
import SocketProvider from "./src/context/SocketContext";
import StackNavigations from "./src/Navigations/StackNavigation";
import configureStore from "./src/store";
import OneSignal from "react-native-onesignal";
import ConnectyCube from "react-native-connectycube";
import CallService from "./src/services/call-service";
import pushNotificationService from "./src/services/PushNotificationService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { firebase } from "@react-native-firebase/analytics";
import { notificationListener, requestUserPermission } from "./src/utility/firebaseUtils";

enableFreeze();
enableScreens();

LogBox.ignoreAllLogs();

Sentry.init({
  dsn: "https://a3d1de0d9f9b4f028cf02bfe934bc868@o4504494817345536.ingest.sentry.io/4504497048322048",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  ignoreErrors: ["Non-Error exception captured"]
});

const { store } = configureStore();
CallService.getStore(store);
// pushNotificationService.getStore(store);

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
    authSecret: "RLAjfBYRt9gSFfs"
  };
  const CONFIG = {
    debug: { mode: 0 }
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

const App = () => {
  const navigationRef = useRef(createNavigationContainerRef());
  const routeNameRef = useRef();
  const { mobileNumber, email } = useSelector(store => store.userReducer);

  useEffect(() => {
    initAnalytics();
  }, []);

  const initAnalytics = async () => {
    await firebase.analytics().setAnalyticsCollectionEnabled(true);
  };

  const onStateChange = async () => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;

    if (previousRouteName !== currentRouteName) {
      await firebase.analytics().logScreenView({
        screen_name: currentRouteName,
        screen_class: currentRouteName
      });
      routeNameRef.current = currentRouteName;
    }
  };
  // // OneSignal Initialization
  // OneSignal.initialize("04e507aa-792a-45f8-9d6d-55859c8dbd92");

  // // requestPermission will show the native iOS or Android notification permission prompt.
  // // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
  // OneSignal?.Notifications?.requestPermission(true);

  // // Method for listening for notification clicks
  // OneSignal?.Notifications?.addEventListener("click", event => {
  //   console.log("OneSignal: notification clicked:", event);
  //   if (mobileNumber || email) {
  //     if (event.notification.body.includes("received")) {
  //       navigate("moves");
  //     } else if (
  //       event.notification.additionalData.hasOwnProperty("chatRecord")
  //     ) {
  //       navigate("chat", event.notification.additionalData.chatRecord);
  //     }
  //   }
  // });

  // OneSignal Initialization
  OneSignal.setAppId("04e507aa-792a-45f8-9d6d-55859c8dbd92");

  //Prompt for push on iOS and android
  OneSignal.promptForPushNotificationsWithUserResponse();

  //Method for handling notifications received while app in foreground
  OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
    let notification = notificationReceivedEvent.getNotification();

    // Complete with null means don't show a notification.
    notificationReceivedEvent.complete(notification);
  });

  //Method for handling notifications opened
  OneSignal.setNotificationOpenedHandler(notification => {
    console.log("OneSignal: notification opened:", notification);

    if (mobileNumber || email) {
      if (notification.notification.body.includes("received")) {
        navigate("moves");
      } else if (notification.notification.additionalData.hasOwnProperty("chatRecord")) {
        navigate("chat", notification.notification.additionalData?.chatRecord);
      }
    }
  });

  const navigate = (name, param = null) => {
    if (navigationRef.current?.isReady()) {
      if (name == "moves") {
        setTimeout(() => {
          navigationRef.current.navigate("BottomTab", {
            screen: "Interactions"
          });
        }, 2700);
      } else if (name == "chat") {
        setTimeout(() => {
          navigationRef.current.navigate("BottomTab", {
            screen: "UserChatList",
            params: {
              screen: "UserChatListScreen",
              params: {
                chatHeadId: param.chatHeadId
              }
            }
          });
        }, 2700);
      }
    }
  };

  useEffect(() => {
    requestUserPermission();
    notificationListener();
    // checkToken();
    createConnectyCubeSession();

    MobileAds()
      .initialize()
      .then(adapterStatuses => {
        // Initialization complete!
        console.log("adapterStatuses", adapterStatuses);
      })
      .catch(err => console.log("adapter err", err));
  }, []);

  return (
    <SocketProvider>
      <NavigationContainer ref={navigationRef} onStateChange={onStateChange}>
        <StackNavigations />
        <Toast />
      </NavigationContainer>
    </SocketProvider>
  );
};

// export default Sentry.wrap(App);
export default withIAPContext(App);
