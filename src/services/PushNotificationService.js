import { Platform } from "react-native";
import { android, ios } from "../utility/size";
import { setCallSession } from "../store/actions";
import { getUniqueId } from "react-native-device-info";
import { Notifications } from "react-native-notifications";

import invokeApp from "react-native-invoke-app";
import ConnectyCube from "react-native-connectycube";
import PermissionsService from "./permissions-service";

let store;

class PushNotificationsService {
  constructor() {
    this._registerBackgroundTasks();
  }

  getStore(storeFromApp) {
    store = storeFromApp;
  }

  init() {
    if (ios) {
      Notifications.ios.checkPermissions().then(currentPermissions => {});
    }

    Notifications.getInitialNotification()
      .then(notification => {})
      .catch(err => console.error("getInitialNotifiation() failed", err));

    Notifications.events().registerRemoteNotificationsRegistered(event => {
      this.subscribeToPushNotifications(event.deviceToken);
    });

    Notifications.events().registerRemoteNotificationsRegistrationFailed(
      event => {}
    );

    // VoIP
    if (ios) {
      Notifications.ios.events().registerPushKitRegistered(event => {
        this.subscribeToVOIPPushNotifications(event.pushKitToken);
      });
    }

    Notifications.events().registerNotificationReceivedForeground(
      (notification, completion) => {
        completion({ alert: false, sound: false, badge: false });
      }
    );

    Notifications.events().registerNotificationReceivedBackground(
      async (notification, completion) => {
        if (android) {
          if (await PermissionsService.isDrawOverlaysPermisisonGranted()) {
            invokeApp();

            const dummyCallSession = {
              initiatorID: notification.initiatorId,
              opponentsIDs: notification.opponentsIds.split(","),
              ID: notification.uuid,
            };
            store.dispatch(setCallSession(dummyCallSession, true, true));
          } else {
            PushNotificationsService.displayNotification(notification.payload);
          }
        }

        completion({ alert: true, sound: true, badge: false });
      }
    );

    Notifications.events().registerNotificationOpened(
      async (notification, completion) => {
        completion();
      }
    );

    Notifications.registerRemoteNotifications();

    if (ios) {
      Notifications.ios.registerPushKit();
    }
  }

  static displayNotification(payload) {
    const extra = { dialog_id: payload.dialog_id, isLocal: true };

    const localNotification = Notifications.postLocalNotification({
      body: payload.message,
      title: "New message",
      silent: false,
      category: "SOME_CATEGORY",
      userInfo: extra,
      extra,
    });
  }

  _registerBackgroundTasks() {
    if (ios) {
      return;
    }

    const { AppRegistry } = require("react-native");

    AppRegistry.registerHeadlessTask("JSNotifyWhenKilledTask", () => {
      return async notificationBundle => {
        if (await PermissionsService.isDrawOverlaysPermisisonGranted()) {
          invokeApp();

          const dummyCallSession = {
            initiatorID: notificationBundle.initiatorId,
            opponentsIDs: notificationBundle.opponentsIds.split(","),
            ID: notificationBundle.uuid,
          };
          store.dispatch(setCallSession(dummyCallSession, true, true));
        } else {
          PushNotificationsService.displayNotification(notificationBundle);
        }
      };
    });
  }

  async subscribeToPushNotifications(deviceToken) {
    const params = {
      notification_channel: ios ? "apns" : "gcm",
      device: {
        platform: Platform.OS,
        udid: await getUniqueId(),
      },
      push_token: {
        environment: __DEV__ ? "development" : "production",
        client_identification_sequence: deviceToken,
      },
    };

    ConnectyCube.pushnotifications.subscriptions
      .create(params)
      .then(result => {})
      .catch(error => {
        console.warn(
          "[PushNotificationsService][subscribeToPushNotifications] Error",
          JSON.stringify(error)
        );
      });
  }

  async subscribeToVOIPPushNotifications(deviceToken) {
    const params = {
      notification_channel: "apns_voip",
      device: {
        platform: Platform.OS,
        udid: await getUniqueId(),
      },
      push_token: {
        environment: __DEV__ ? "development" : "production",
        client_identification_sequence: deviceToken,
      },
    };

    ConnectyCube.pushnotifications.subscriptions
      .create(params)
      .then(result => {})
      .catch(error => {
        console.warn(
          "[PushNotificationsService][subscribeToVOIPPushNotifications] Error",
          error
        );
      });
  }

  async deleteSubscription() {
    const deviceUdid = await getUniqueId();
    ConnectyCube.pushnotifications.subscriptions
      .list()
      .then(result => {
        for (let item of result) {
          const subscription = item.subscription;
          if (
            subscription.device.platform.name === Platform.OS &&
            subscription.device.udid === deviceUdid
          ) {
            ConnectyCube.pushnotifications.subscriptions
              .delete(subscription.id)
              .then(result => {})
              .catch(error => {
                console.warn(
                  "[PushNotificationsService][deleteSubscription] Error1",
                  JSON.stringify(error)
                );
              });
          }
        }
      })
      .catch(error => {
        console.warn(
          "[PushNotificationsService][deleteSubscription] Error2",
          error
        );
      });
  }

  sendPushNotification(recipientsUsersIds, params) {
    const payload = JSON.stringify(params);
    const pushParameters = {
      notification_type: "push",
      user: { ids: recipientsUsersIds },
      environment: __DEV__ ? "development" : "production",
      message: ConnectyCube.pushnotifications.base64Encode(payload),
    };

    ConnectyCube.pushnotifications.events
      .create(pushParameters)
      .then(result => {
        console.log("[PushNotificationsService][sendPushNotification] Ok");
      })
      .catch(error => {
        console.warn(
          "[PushNotificationsService][sendPushNotification] Error",
          JSON.stringify(error)
        );
      });
  }
}

const pushNotificationsService = new PushNotificationsService();
export default pushNotificationsService;
