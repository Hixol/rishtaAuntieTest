import {createReducer} from '@reduxjs/toolkit';

const initialState = {
  index: 0,
  chat: [],
  dob: '',
  userHeight: 0,
  selfieImage: null,
  trackIndex: 0,
  promptsIndex: 0,
  promptsPool: [],
  modalPosition: -1,
  videoFlag: false,
  coords: {
    lat: 0,
    lng: 0,
    city: '',
    state: '',
    address: '',
    country: '',
  },
};

export const chatReducer = createReducer(initialState, {
  //This is the action that will be called when the action is dispatched
  INDEX: (state, action) => {
    const {payload} = action;
    state.index = payload;
  },

  UPDATE_COORDS: (state, action) => {
    const {payload} = action;
    state.coords.lat = payload.lat;
    state.coords.lng = payload.lng;
    state.coords.city = payload.city;
    state.coords.state = payload.state;
    state.coords.address = payload.address;
    state.coords.country = payload.mulk;
  },

  CHAT: (state, action) => {
    const {payload} = action;
    state.chat.push(payload);
  },

  UPDATE_CHAT: (state, action) => {
    const {payload} = action;
    const updateQuestion = state.chat.find(item => item.id == payload.id);
    updateQuestion.isAnswered = payload.isAnswered;
    updateQuestion.answer = payload.answer;
  },

  SET_REMOVE_CHAT: (state, action) => {
    const {payload} = action;
    const filteredChat = state.chat.filter(el => el.id != payload);
    state.chat = filteredChat;
  },

  EMPTY_CHAT: (state, action) => {
    const {paylod} = action;
    state.chat = [];
  },

  DOB: (state, action) => {
    const {payload} = action;
    state.dob = payload;
  },

  SET_USER_HEIGHT: (state, action) => {
    const {payload} = action;
    state.userHeight = payload;
  },

  SELFIE_IMAGE: (state, action) => {
    const {payload} = action;
    state.selfieImage = payload;
  },

  TRACK_INDEX: (state, action) => {
    const {payload} = action;
    state.trackIndex = payload;
  },

  PROMPTS_INDEX: (state, action) => {
    const {payload} = action;
    state.promptsIndex = payload;
  },

  PROMPTS_POOL: (state, action) => {
    const {payload} = action;
    state.promptsPool = payload;
  },

  UPDATE_POOL: (state, action) => {
    const {payload} = action;
    const updateQuestion = state.promptsPool.find(
      item => item.id == payload.id,
    );
    updateQuestion.isAnswered = payload.isAnswered;
    updateQuestion.answer = payload.answer;
  },

  MODAL_POSITION: (state, action) => {
    const {payload} = action;
    state.modalPosition = payload;
  },

  SET_VIDEO_FLAG: (state, action) => {
    const {payload} = action;
    state.videoFlag = payload;
  },
});
