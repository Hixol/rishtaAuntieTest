import * as ACTION_TYPES from '../types';

let ActiveCall = {
  session: null,
  isIcoming: false,
  isAccepted: false,
  isEarlyAccepted: false, // used when accepted via Call Kit, but the call session is not arrived yet
  isDummySession: false, // used when got incoming call on Android in bg/killed
  isMicrophoneMuted: false,
  streams: [],
};

export default (state = ActiveCall, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_CALL_SESSION:
      const {session, isIcoming, isDummySession} = action;
      return {
        ...state,
        session,
        isIcoming,
        isDummySession,
      };

    case ACTION_TYPES.MUTE_MICROPHONE:
      return {
        ...state,
        isMicrophoneMuted: action.isMuted,
      };

    case ACTION_TYPES.ACCEPT_CALL:
      return {
        ...state,
        isAccepted: true,
      };

    case ACTION_TYPES.DELAYED_ACCEPT_CALL:
      return {
        ...state,
        isEarlyAccepted: true,
      };

    case ACTION_TYPES.ADD_OR_UPDATE_STREAMS:
      const {streams} = action;

      let updatedStreams = [...state.streams];
      for (let stream of streams) {
        const existingStream = updatedStreams.find(
          s => s.userId === stream.userId,
        );
        updatedStreams = existingStream
          ? updatedStreams.map(s => (s.userId !== stream.userId ? s : stream)) // replace
          : [...updatedStreams, stream]; // add
      }

      return {
        ...state,
        streams: updatedStreams,
      };

    case ACTION_TYPES.REMOVE_STREAM:
      return {
        ...state,
        streams: state.streams.filter(s => s.userId !== action.stream.userId),
      };

    case ACTION_TYPES.RESET_ACTIVE_CALL:
      return {
        ...state,
        session: null,
        isIcoming: false,
        isAccepted: false,
        isEarlyAccepted: false,
        isDummySession: false,
        isMicrophoneMuted: false,
        streams: [],
      };

    default:
      return state;
  }
};
