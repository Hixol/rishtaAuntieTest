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
  incomingUpdate,
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

  getStore(storeFromApp) {
    store = storeFromApp;
  }

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
      console.log("STREAMS ", streams);
      streams.push({ userId: uId, stream: null });
    }

    store.dispatch(addOrUpdateStreams(streams));
    store.dispatch(incomingUpdate(true));

    this.callSession.call({ options });

    // const userName = `${this.currentUser.firstName}``${this.currentUser.lastName}`;
    const receivedNames = await getCallRecipientString(usersIds);
    console.log("stststststststs", streams);
    // report to CallKit (iOS only)
    this.reportStartCall(
      this.callSession.ID,
      // userName,
      "sfsf",
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
  reportStartCall(callUUID, handle, contactIdentifier, isVideoCall) {
    RNCallKeep.startCall(callUUID, handle, contactIdentifier, isVideoCall);
  }

  // Use reportConnecting to update the system after the outgoing call has started connecting
  reportConnectingOutgoingCall(callUUID) {
    RNCallKeep.reportConnectingOutgoingCall(callUUID);
  }

  // Use reportConnected to update the system once the call is connected

  // Use endCall to tell the system that the call has ended
  reportEndCall(callUUID) {
    RNCallKeep.endCall(callUUID);
  }

  // Use endAllCalls to tell the system that all calls have ended
  reportEndAllCalls() {
    RNCallKeep.endAllCalls();
  }

  // Use displayIncomingCall to display incoming call to the system
  async reportIncomingCall(
    callUUID,
    handle,
    contactIdentifier,
    isVideo,
    hasVideo
  ) {
    RNCallKeep.displayIncomingCall(
      callUUID,
      handle,
      contactIdentifier,
      isVideo,
      hasVideo
    );
    const data = await getUserById(callUUID);
    showToast(alerts.incoming_call, data);
  }

  // Use answerCall to tell the system that the call has been answered
  reportAnswerCall(callUUID) {
    RNCallKeep.answerIncomingCall(callUUID);
  }

  // Use rejectCall to tell the system that the call has been rejected
  reportRejectCall(callUUID) {
    RNCallKeep.rejectCall(callUUID);
  }

  reportMutedCall(callUUID, muted) {
    RNCallKeep.reportMutedCall(callUUID, muted);
  }

  // CallKit Events
  //

  onAnswerCallAction = data => {
    const { callUUID } = data;
    if (!this.isAccepted) {
      // by some reason, this event could fire > 1 times
      this.acceptCall({}, true);
    }
  };

  onEndCallAction = data => {
    this.stopCall({}, true);
  };

  onToggleMute = data => {
    const { muted } = data;

    this.muteMicrophone(muted, true);
  };

  onChangeAudioRoute = data => {
    const { output, portName } = data;
    console.log("[CallKitService][onChangeAudioRoute] output:", output);
    console.log("[CallKitService][onChangeAudioRoute] portName:", portName);
  };

  onLoadWithEvents = data => {
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

    const missedCalls = data.filter(
      d => d.name === CK_CONSTANTS.DID_DISPLAY_INCOMING_CALL
    );
    if (missedCalls && missedCalls.length > 0) {
      const lastMissedCall = missedCalls[missedCalls.length - 1];
      const { callUUID } = lastMissedCall;
      this.rejectCall({ callUUID });
    }
  };

  // ConnectyCube Video Chat listeners
  //

  _onCallListener(session, extension) {
    const sessionId = session?.ID;

    if (this.callSession) {
      const errorMessage = "You already have a call session.";
      showToast(alerts.error, errorMessage);
      session.reject({ reason: errorMessage });
      return;
    }

    if (!sessionId) {
      const errorMessage = "Call session ID is undefined.";
      showToast(alerts.error, errorMessage);
      session.reject({ reason: errorMessage });
      return;
    }
    store.dispatch(incomingUpdate(true));
    if (this.isEarlyAccepted && !this.isAccepted) {
      setTimeout(() => {
        // wait until redux updated the data
        this.acceptCall();
      });
    }
    store.dispatch(
      setCallSession(
        session,
        extension?.callType !== CallService.CALL_TYPE.video
      )
    );

    // if (Platform.OS === "ios") {
    // report to CallKit (iOS only)
    // this.reportIncomingCall(
    //   sessionId,
    //   `${this.currentUser.firstName}``${this.currentUser.lastName}`,
    //   "user_id",
    //   extension.callType === CallService.CALL_TYPE.video,
    //   extension.callType === CallService.CALL_TYPE.video
    // );
    // }

    this.playSound("incoming");
  }

  _onAcceptCallListener(session, userId, extension) {
    console.log("onAcceptCallListener, userId: ", userId);

    this.stopSounds();
    const userIdInt = parseInt(userId, 10);
    const stream = this.streams.filter(s => s.userId === userIdInt)[0];

    if (stream) {
      stream.stream = session.connection.getRemoteMediaStream(userIdInt);
    } else {
      const newStream = {
        userId: userIdInt,
        stream: session.connection.getRemoteMediaStream(userIdInt),
      };

      store.dispatch(addOrUpdateStreams([newStream]));
    }
  }

  _onRejectCallListener(session, userId, extension) {
    console.log("onRejectCallListener, userId: ", userId);

    const userIdInt = parseInt(userId, 10);
    store.dispatch(removeStream({ userId: userIdInt }));

    if (this.streams.length === 0) {
      this.stopCall({}, true);
    }
  }

  _onStopCallListener(session, userId, extension) {
    console.log("onStopCallListener, userId: ", userId);

    const userIdInt = parseInt(userId, 10);
    store.dispatch(removeStream({ userId: userIdInt }));

    if (this.streams.length === 0) {
      this.stopCall({}, true);
    }
  }

  _onUserNotAnswerListener(session, userId) {
    console.log("onUserNotAnswerListener, userId: ", userId);

    const userIdInt = parseInt(userId, 10);
    store.dispatch(removeStream({ userId: userIdInt }));

    if (this.streams.length === 0) {
      this.stopCall({}, true);
    }
  }

  _onRemoteStreamListener(session, userId, stream) {
    console.log("onRemoteStreamListener, userId: ", userId);

    const userIdInt = parseInt(userId, 10);
    const streams = this.streams.filter(s => s.userId === userIdInt);

    if (streams.length) {
      streams.forEach(s => {
        s.stream = stream;
      });
    } else {
      const newStream = {
        userId: userIdInt,
        stream: stream,
      };

      store.dispatch(addOrUpdateStreams([newStream]));
    }
  }
}

const callService = new CallService();
export default callService;
