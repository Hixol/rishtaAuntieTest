import { AppState } from "react-native";
import { PERMISSIONS, request } from "react-native-permissions";

import messaging from "@react-native-firebase/messaging";
import { android } from "./size";
// import notifee from "@notifee/react-native";

export const requestUserPermission = async () => {
  try {
    await messaging().requestPermission();
    if (android) await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);

    const token = await messaging().getToken();
    console.log("fcm token ====>", token);
    return token;
  } catch (err) {
    console.log("requestUserPermission err", err);
  }
};

export const notificationListener = async () => {
  try {
    messaging().onNotificationOpenedApp(() => {});
    messaging().onMessage(async remoteMessage => {
      if (AppState.currentState === "active") {
        // Show a foreground notification using the system's notification API
        // const channelId = await notifee.createChannel({
        //   id: "default",
        //   name: "main channel",
        // });
        // // Display a notification
        // await notifee.displayNotification({
        //   title: remoteMessage.notification?.title,
        //   body: remoteMessage.notification?.body,
        //   data: remoteMessage.data,
        //   android: {
        //     channelId,
        //     color: COLORS.blue3,
        //     localOnly: true,
        //     pressAction: {
        //       id: "default",
        //     },
        //   },
        // });
      }
    });

    await messaging().getInitialNotification();
  } catch (err) {
    console.log("notificationListener err", err);
  }
};
