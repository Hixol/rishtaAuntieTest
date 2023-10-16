import * as ACTION_TYPES from '../types';

export const setCallSession = (
  session,
  isIcoming = false,
  isDummySession = false,
) => ({
  type: ACTION_TYPES.SET_CALL_SESSION,
  session,
  isIcoming,
  isDummySession,
});

export const resetActiveCall = () => ({type: ACTION_TYPES.RESET_ACTIVE_CALL});

export const acceptCall = () => ({type: ACTION_TYPES.ACCEPT_CALL});

export const delayedAcceptCall = () => ({
  type: ACTION_TYPES.DELAYED_ACCEPT_CALL,
});

export const muteMicrophone = isMuted => ({
  type: ACTION_TYPES.MUTE_MICROPHONE,
  isMuted,
});

export const addOrUpdateStreams = streams => ({
  type: ACTION_TYPES.ADD_OR_UPDATE_STREAMS,
  streams,
});

export const removeStream = stream => ({
  type: ACTION_TYPES.REMOVE_STREAM,
  stream,
});
