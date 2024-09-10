// reducers.js
import {
  SET_CALL_SESSION,
  ADD_OR_UPDATE_STREAMS,
  REMOVE_STREAM,
  RESET_ACTIVE_CALL,
  ACCEPT_CALL,
  EARLY_ACCEPT_CALL,
  MUTE_MICROPHONE,
  INCOMING_UPDATE,
} from "../actions/ActiveCall";

const initialState = {
  session: null,
  streams: [],
  isAccepted: false,
  isEarlyAccepted: false,
  isDummySession: false,
  incoming: false,
};

const activeCallReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CALL_SESSION:
      return {
        ...state,
        session: action.payload.session,
        isDummySession: action.payload.isDummySession,
      };
    case ADD_OR_UPDATE_STREAMS:
      // update or add streams logic
      return {
        ...state,
        streams: [
          ...state.streams.filter(
            stream => !action.payload.find(s => s.userId === stream.userId)
          ),
          ...action.payload,
        ],
      };
    case REMOVE_STREAM:
      return {
        ...state,
        streams: state.streams.filter(
          stream => stream.userId !== action.payload.userId
        ),
      };
    case RESET_ACTIVE_CALL:
      return initialState;
    case ACCEPT_CALL:
      return {
        ...state,
        isAccepted: true,
      };
    case EARLY_ACCEPT_CALL:
      return {
        ...state,
        isEarlyAccepted: true,
      };
    case MUTE_MICROPHONE:
      return {
        ...state,
        isMuted: action.payload,
      };
    case INCOMING_UPDATE:
      return {
        ...state,
        incoming: action.payload,
      };
    default:
      return state;
  }
};

export default activeCallReducer;
