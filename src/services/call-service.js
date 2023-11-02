import ConnectyCube from "react-native-connectycube";
import InCallManager from "react-native-incall-manager";
import Sound from "react-native-sound";
import { getApplicationName } from "react-native-device-info";
import RNCallKeep, { CONSTANTS as CK_CONSTANTS } from "react-native-callkeep";
import RNUserdefaults from "react-native-user-defaults";

import {
  showToast,
  getUserById,
  getCallRecipientString,
} from "../utility/utils";
import {
  addOrUpdateStreams,
  removeStream,
  resetActiveCall,
  setCallSession,
  acceptCall,
  earlyAcceptCall,
  muteMicrophone,
} from "../store/actions";
import { Platform } from "react-native";
import { alerts } from "../utility/regex";
import ChatServices from "./ChatServices";
import moment from "moment";

const LOCAL_STREAM_USER_ID = "localStream";
let store;

class CallService {
  static MEDIA_OPTIONS = { audio: true, video: { facingMode: "user" } };
  static MEDIA_OPTIONS_AUDIO = { audio: true };
  static CALL_TYPE = {
    voice: "VOICE_CALL",
    video: "VIDEO_CALL",
  };
  static LOG_TYPE = {
    missed: "MISSED_CALL",
    received: "RECEIVED_CALL",
  };

  mediaDevices = [];

  _outgoingCallSound = null;
  _incomingCallSound = null;
  _endCallSound = null;

  constructor() {
    this._outgoingCallSound = new Sound(
      require("../assets/sounds/dialing.mp3")
    );
    this._incomingCallSound = new Sound(
      require("../assets/sounds/calling.mp3")
    );
    this._endCallSound = new Sound(require("../assets/sounds/end_call.mp3"));
    this.token = null;
    this.otherUserId = null;
    this.startDate = 0;
    this.endDate = 0;
    this.executed = false;
  }

  getStore = storeFromApp => {
    store = storeFromApp;
  };

  init() {
    ConnectyCube.videochat.onCallListener = this._onCallListener.bind(this);
    ConnectyCube.videochat.onAcceptCallListener =
      this._onAcceptCallListener.bind(this);
    ConnectyCube.videochat.onRejectCallListener =
      this._onRejectCallListener.bind(this);
    ConnectyCube.videochat.onStopCallListener =
      this._onStopCallListener.bind(this);
    ConnectyCube.videochat.onUserNotAnswerListener =
      this._onUserNotAnswerListener.bind(this);
    ConnectyCube.videochat.onRemoteStreamListener =
      this._onRemoteStreamListener.bind(this);

    this.initCallKit();
  }

  initCallKit() {
    if (Platform.OS !== "ios") {
      return;
    }

    const options = {
      ios: {
        appName: getApplicationName(),
        includesCallsInRecents: false,
      },
    };

    RNCallKeep.setup(options)
      .then(() => {})
      .catch(err => {
        console.error("[CallKitService][setup] Error:", err.message);
      });

    // Add RNCallKeep Events
    RNCallKeep.addEventListener("answerCall", this.onAnswerCallAction);
    RNCallKeep.addEventListener("endCall", this.onEndCallAction);
    RNCallKeep.addEventListener(
      "didPerformSetMutedCallAction",
      this.onToggleMute
    );
    RNCallKeep.addEventListener("didChangeAudioRoute", this.onChangeAudioRoute);
    RNCallKeep.addEventListener("didLoadWithEvents", this.onLoadWithEvents);
  }

  get callSession() {
    return store.getState().ActiveCall.session;
  }

  get streams() {
    return store.getState().ActiveCall.streams;
  }

  get currentUser() {
    return store.getState().userReducer.userData;
  }

  get isEarlyAccepted() {
    return store.getState().ActiveCall.isEarlyAccepted;
  }

  get isAccepted() {
    return store.getState().ActiveCall.isAccepted;
  }

  get isDummySession() {
    return store.getState().ActiveCall.isDummySession;
  }

  async startCall(usersIds, type, options = {}) {
    const session = ConnectyCube.videochat.createNewSession(
      usersIds,
      type,
      options
    );
    store.dispatch(setCallSession(session));

    await this.setMediaDevices();

    const stream = await this.callSession.getUserMedia(
      type == 2 ? CallService.MEDIA_OPTIONS_AUDIO : CallService.MEDIA_OPTIONS
    );

    // store streams
    const streams = [{ userId: LOCAL_STREAM_USER_ID, stream: stream }];
    for (const uId of usersIds) {
      streams.push({ userId: uId, stream: null });
    }
    store.dispatch(addOrUpdateStreams(streams));

    this.callSession.call({ options });

    const userName = `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    const receivedNames = await getCallRecipientString(usersIds);

    // report to CallKit (iOS only)
    this.reportStartCall(
      this.callSession.ID,
      userName,
      receivedNames,
      "generic",
      type === "video"
    );

    this.playSound("outgoing");

    return session;
  }

  async acceptCall(options = {}, skipCallKit = false) {
    if (!this.callSession || this.isDummySession) {
      store.dispatch(earlyAcceptCall());

      return;
    }

    await this.setMediaDevices();

    // create local stream
    const stream = await this.callSession.getUserMedia(
      this.callSession.callType == 2
        ? CallService.MEDIA_OPTIONS_AUDIO
        : CallService.MEDIA_OPTIONS
    );

    // store streams
    const streams = [{ userId: LOCAL_STREAM_USER_ID, stream: stream }];
    const opponentsIds = [
      this.callSession.initiatorID,
      ...this.callSession.opponentsIDs.filter(
        oid => oid !== this.callSession.currentUserID
      ),
    ];
    for (const uId of opponentsIds) {
      streams.push({ userId: uId, stream: null });
    }
    store.dispatch(addOrUpdateStreams(streams));

    this.callSession.accept(options);

    if (!skipCallKit) {
      // report to Call Kit (iOS only)
      this.reportAcceptCall(this.callSession.ID);
    }

    this.stopSounds();
    store.dispatch(acceptCall());

    this.startDate = moment(Date.now());
    this.executed = false;
  }

  stopCall(options = {}, skipCallKit = false) {
    if (this.callSession) {
      this.callSession.stop(options);
      ConnectyCube.videochat.clearSession(this.callSession.ID);

      this.playSound("end");

      if (!skipCallKit) {
        // report to Call Kit (iOS only)
        this.reportEndCall(this.callSession.ID);
      }

      store.dispatch(resetActiveCall());
    }

    this.stopSounds();
  }

  rejectCall(options = {}, skipCallKit = false) {
    if (this.callSession) {
      if (this.isDummySession) {
        ConnectyCube.videochat
          .callRejectRequest({
            sessionID: this.callSession.ID,
            platform: Platform.OS,
            recipientId: this.callSession.initiatorID,
          })
          .then(() => {});
      } else {
        this.callSession.reject(options);
      }

      if (!skipCallKit) {
        // report to CallKit (iOS only)
        this.reportRejectCall(this.callSession.ID);
      }

      store.dispatch(resetActiveCall());
    }

    this.stopSounds();
    this.startDate = 0;
  }

  muteMicrophone(isMute, skipCallKit = false) {
    if (isMute) {
      this.callSession?.mute("audio");
    } else {
      this.callSession?.unmute("audio");
    }

    store.dispatch(muteMicrophone(isMute));

    if (!skipCallKit) {
      this.reportMutedCall(this.callSession?.ID, isMute);
    }
  }

  switchCamera() {
    const localStream = this.streams.filter(
      s => s.userId === LOCAL_STREAM_USER_ID
    )[0];
    localStream.stream.getVideoTracks().forEach(track => track._switchCamera());
  }

  setSpeakerphoneOn = flag => InCallManager.setSpeakerphoneOn(flag);

  playSound(type) {
    switch (type) {
      case "outgoing":
        this._outgoingCallSound.setNumberOfLoops(-1);
        this._outgoingCallSound.play();
        break;
      case "incoming":
        this._incomingCallSound.setNumberOfLoops(-1);
        this._incomingCallSound.play();
        break;
      case "end":
        this._endCallSound.play();
        break;

      default:
        break;
    }
  }

  stopSounds() {
    if (this._incomingCallSound.isPlaying()) {
      this._incomingCallSound.pause();
    }
    if (this._outgoingCallSound.isPlaying()) {
      this._outgoingCallSound.pause();
    }
  }

  async setMediaDevices() {
    const mediaDevices = await ConnectyCube.videochat.getMediaDevices();
    this.mediaDevices = mediaDevices;
  }

  // CallKit API
  //

  // Use startCall to ask the system to start a call - Initiate an outgoing call from this point
  reportStartCall(callUUID, handle, contactIdentifier, handleType, hasVideo) {
    if (Platform.OS !== "ios") {
      return;
    }

    // Your normal start call action
    RNCallKeep.startCall(
      callUUID,
      handle,
      contactIdentifier,
      handleType,
      hasVideo
    );
  }

  reportAcceptCall(callUUID) {
    if (Platform.OS !== "ios") {
      return;
    }

    // Your normal start call action
    RNCallKeep.answerIncomingCall(callUUID);
  }

  reportRejectCall(callUUID) {
    if (Platform.OS !== "ios") {
      return;
    }

    RNCallKeep.rejectCall(callUUID);
  }

  reportEndCall(callUUID) {
    if (Platform.OS !== "ios") {
      return;
    }

    RNCallKeep.endCall(callUUID);
  }

  reportMutedCall(callUUID, isMuted) {
    if (Platform.OS !== "ios") {
      return;
    }

    RNCallKeep.setMutedCall(callUUID, isMuted);
  }

  reportEndCallWithoutUserInitiating(callUUID, reason) {
    if (Platform.OS !== "ios") {
      return;
    }

    store.dispatch(setCallSession(null));
    RNCallKeep.reportEndCallWithUUID(callUUID, reason);
  }

  // Call callbacks
  //

  onPostCallLog(payload, token) {
    ChatServices.postCallLog(payload, token)
      .then(res => {
        if (res.status >= 200 && res.status <= 299) {
        } else if (res.status >= 300 && res.status <= 399) {
          alerts(
            "error",
            "You need to perform further actions to complete the request!"
          );
        } else if (res.status >= 400 && res.status <= 499) {
          alerts("error", res.data?.error?.message);
        } else if (res.status >= 500 && res.status <= 599) {
          alerts(
            "error",
            "Internal server error! Your server is probably down."
          );
        } else {
          alerts("error", "Something went wrong. Please try again later!");
        }
      })
      .catch(err => console.log("postCallLog err:", err));
  }

  async _onCallListener(session, extension) {
    this.token = extension.options.token;
    this.otherUserId = extension.options.userId;

    // if already on a call
    if (this.callSession && !this.isDummySession) {
      this.rejectCall(session, { already_on_call: true });
      return;
    }

    this.playSound("incoming");

    if (this.isEarlyAccepted && !this.isAccepted) {
      setTimeout(() => {
        // wait until redux updated the data
        this.acceptCall();
      });
    }

    store.dispatch(setCallSession(session, true));
  }

  async _onAcceptCallListener(session, userId, extension) {
    if (this.callSession) {
      this.stopSounds();
    }

    getUserById(userId, "full_name").then(res => {
      showToast(`${res.firstName} has accepted the call`);
    });
  }

  async _onRejectCallListener(session, userId, extension) {
    store.dispatch(removeStream({ userId }));

    getUserById(userId, "full_name").then(res => {
      const message = extension.already_on_call
        ? `${res.firstName} is busy (already on a call)`
        : `${res.firstName} rejected the call request`;

      showToast(message);
    });
  }

  resetValues() {
    this.token = null;
    this.otherUserId = null;
    this.startDate = 0;
    this.endDate = 0;
  }

  async _onStopCallListener(session, userId, extension) {
    this.stopSounds();

    getUserById(userId, "full_name").then(res => {
      showToast(`${res.firstName} has left the call`);
    });

    store.dispatch(removeStream({ userId }));
    if (this.streams.length <= 1) {
      store.dispatch(resetActiveCall());

      // report to CallKit (iOS only)
      //
      this.reportEndCallWithoutUserInitiating(
        session.ID,
        CK_CONSTANTS.END_CALL_REASONS.REMOTE_ENDED
      );
    }

    this.endDate = moment(Date.now());
    let diff = moment.duration(this.endDate.diff(this.startDate));
    let seconds = Math.floor(diff.asSeconds());

    let obj = {
      otherUserId: this.otherUserId,
      duration: this.startDate == 0 ? 0 : seconds,
      callType:
        CallService.CALL_TYPE[session.callType == 2 ? "voice" : "video"],
      logType:
        this.startDate == 0
          ? CallService.LOG_TYPE.missed
          : CallService.LOG_TYPE.received,
    };

    if (this.token) {
      var runOnlyOnce = (() => {
        return () => {
          if (!this.executed) {
            this.executed = true;
            console.log("[RECEIVED] Function ran once!");
            this.onPostCallLog(obj, this.token);
          }
        };
      })();
      runOnlyOnce();
    }
    this.resetValues();
  }

  async _onUserNotAnswerListener(session, userId) {
    getUserById(userId, "full_name").then(res => {
      showToast(`${res.firstName} did not answer`);
    });
    store.dispatch(removeStream({ userId }));

    let obj = {
      otherUserId: this.otherUserId,
      duration: 0,
      callType:
        CallService.CALL_TYPE[session.callType == 2 ? "voice" : "video"],
      logType: CallService.LOG_TYPE.missed,
    };

    if (this.token) {
      var runOnlyOnce = (() => {
        return () => {
          if (!this.executed) {
            this.executed = true;
            console.log("[MISSED] Function ran once!");
            this.onPostCallLog(obj, this.token);
          }
        };
      })();
      runOnlyOnce();
    }
    this.resetValues();
  }

  async _onRemoteStreamListener(session, userId, stream) {
    store.dispatch(addOrUpdateStreams([{ userId, stream }]));
  }

  onAnswerCallAction = data => {
    // Called when the user answers an incoming call via Call Kit
    if (!this.isAccepted) {
      // by some reason, this event could fire > 1 times
      this.acceptCall({}, true);
    }
  };

  onEndCallAction = async data => {
    let { callUUID } = data;

    if (this.callSession) {
      if (this.isAccepted) {
        this.stopCall({}, true);
      } else {
        this.rejectCall({}, true);
      }
    } else {
      const voipIncomingCallSessions = await RNUserdefaults.get(
        "voipIncomingCallSessions"
      );
      if (voipIncomingCallSessions) {
        const sessionInfo = voipIncomingCallSessions[callUUID];
        if (sessionInfo) {
          const initiatorId = sessionInfo["initiatorId"];

          // most probably this is a call reject, so let's reject it via HTTP API
          ConnectyCube.videochat
            .callRejectRequest({
              sessionID: callUUID,
              platform: Platform.OS,
              recipientId: initiatorId,
            })
            .then(() => {});
        }
      }
    }
  };

  onToggleMute = data => {
    let { muted } = data;
    this.muteMicrophone(muted, true);
  };

  onChangeAudioRoute = data => {
    // could be Speaker or Receiver
  };

  onLoadWithEvents = events => {
    let callDataToAdd = null;
    let callDataToAnswer = null;
    let callDataToReject = null;

    for (let event of events) {
      const { name, data } = event;
      if (name === "RNCallKeepDidDisplayIncomingCall") {
        callDataToAdd = data;
        callDataToAnswer = null;
        callDataToReject = null;
      }
      if (name === "RNCallKeepPerformAnswerCallAction") {
        callDataToReject = null;
        callDataToAnswer = data;
      }
    }

    if (callDataToAdd) {
      if (callDataToAnswer) {
        // Called when the user answers an incoming call via Call Kit
        if (!this.isAccepted) {
          this.acceptCall({}, true);
        }
      }
    }
  };
}

const callService = new CallService();
export default callService;
