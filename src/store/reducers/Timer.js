import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isSpotTimerFinished: null,
  isProfileTimerFinished: null,
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
});
