import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isSpotTimerFinished: null,
  isProfileTimerFinished: null,
  navStartTimer: 0,
  navEndTimer: 0,
};

export const timerReducer = createReducer(initialState, {
  SET_SPOT_TIMER: (state, action) => {
    state.isSpotTimerFinished = {
      userId: action.payload.userId,
      showtimer: action.payload.showtimer,
      time: action.payload.time,
    };
  },

  SET_PROFILE_TIMER: (state, action) => {
    state.isProfileTimerFinished = {
      userId: action.payload.userId,
      showtimer: action.payload.showtimer,
      time: action.payload.time,
    };
  },

  SET_NAV_START_TIMER: (state, action) => {
    state.navStartTimer = action.payload;
  },

  SET_NAV_END_TIMER: (state, action) => {
    state.navEndTimer = action.payload;
  },
});
