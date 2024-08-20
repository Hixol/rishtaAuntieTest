export const SET_CALL_SESSION = "SET_CALL_SESSION";
export const ADD_OR_UPDATE_STREAMS = "ADD_OR_UPDATE_STREAMS";
export const REMOVE_STREAM = "REMOVE_STREAM";
export const RESET_ACTIVE_CALL = "RESET_ACTIVE_CALL";
export const ACCEPT_CALL = "ACCEPT_CALL";
export const EARLY_ACCEPT_CALL = "EARLY_ACCEPT_CALL";
export const MUTE_MICROPHONE = "MUTE_MICROPHONE";
export const INCOMING_UPDATE = "INCOMING_UPDATE";

export const setCallSession = (session, isDummySession = false) => ({
  type: SET_CALL_SESSION,
  payload: { session, isDummySession },
});

export const addOrUpdateStreams = streams => ({
  type: ADD_OR_UPDATE_STREAMS,
  payload: streams,
});

export const removeStream = streamInfo => ({
  type: REMOVE_STREAM,
  payload: streamInfo,
});

export const resetActiveCall = () => ({
  type: RESET_ACTIVE_CALL,
});

export const acceptCall = () => ({
  type: ACCEPT_CALL,
});

export const earlyAcceptCall = () => ({
  type: EARLY_ACCEPT_CALL,
});

export const muteMicrophone = isMute => ({
  type: MUTE_MICROPHONE,
  payload: isMute,
});

export const incomingUpdate = status => ({
  type: INCOMING_UPDATE,
  payload: status,
});
