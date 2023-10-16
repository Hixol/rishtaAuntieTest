import {createReducer} from '@reduxjs/toolkit';

const initialState = {
  token: null,
  userId: null,
  userData: null,
  status: null,
  swipeIndex: true,
  swipeScreenIndex: false,
  updateHomeOne: false,
  mobileNumber: '',
  email: '',
  discoverUserIndex: null,
  preferenceFilter: false,
  settings: {
    isNotificationEnabled: false,
    isDarkMode: false,
    discoveryMode: false,
    hideAge: false,
    chupkeChupke: false,
    hideLiveStatus: false,
    showMessagePreview: false,
  },
};

export const userReducer = createReducer(initialState, {
  //This is the action that will be called when the action is dispatched
  AUTH_TOKEN: (state, action) => {
    const {payload} = action;
    state.token = payload;
  },

  SET_USER_ID: (state, action) => {
    const {payload} = action;
    state.userId = payload;
  },

  AUTH_USER: (state, action) => {
    const {payload} = action;
    state.userData = payload;
  },

  AUTH_USER_STATUS: (state, action) => {
    const {payload} = action;
    state.status = payload;
  },

  AUTH_USER_SWIPE_INDEX: (state, action) => {
    const {payload} = action;
    state.swipeIndex = payload;
  },
  AUTH_USER_SCREEN_INDEX: (state, action) => {
    const {payload} = action;
    state.swipeScreenIndex = payload;
  },
  Update_HomeOne: (state, action) => {
    const {payload} = action;
    state.updateHomeOne = payload;
  },
  USER_MOBILE_NO: (state, action) => {
    const {payload} = action;
    state.mobileNumber = payload;
  },
  USER_EMAIL: (state, action) => {
    const {payload} = action;
    state.email = payload;
  },

  SET_DISCOVER_INDEX: (state, action) => {
    const {payload} = action;
    state.discoverUserIndex = payload;
  },

  SET_PREFERENCE_FILTER: (state, action) => {
    state.preferenceFilter = action.payload;
  },

  USER_IS_NOTIFICATION: (state, action) => {
    const {payload} = action;
    state.settings.isNotificationEnabled = payload;
  },
  USER_IS_DARK_MODE: (state, action) => {
    const {payload} = action;
    state.settings.isDarkMode = payload;
  },
  USER_DISCOVERY_MODE: (state, action) => {
    const {payload} = action;
    state.settings.discoveryMode = payload;
  },
  USER_HIDE_AGE: (state, action) => {
    const {payload} = action;
    state.settings.hideAge = payload;
  },
  USER_CHUPKE_CHUPKE: (state, action) => {
    const {payload} = action;
    state.settings.chupkeChupke = payload;
  },
  USER_HIDE_LIVE_STATUS: (state, action) => {
    const {payload} = action;
    state.settings.hideLiveStatus = payload;
  },
  USER_SHOW_MSG_PREV: (state, action) => {
    const {payload} = action;
    state.settings.showMessagePreview = payload;
  },
});
