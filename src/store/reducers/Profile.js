import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  countries: [],
  communities: [],
  languages: [],
  religions: [],
  denomination: [],
  den: [],
  personalityRes: null,
};

export const profileReducer = createReducer(initialState, {
  //This is the action that will be called when the action is dispatched
  PROFILE_VALUES: (state, action) => {
    const { payload } = action;
    state.countries = payload.familyOrigin.map(x => x.name);
    state.communities = payload.community.map(x => x.name);
    state.languages = payload.language.map(x => x.name);
    state.denomination = payload.denomination;
    state.religions = Object.keys(payload.denomination).sort((a, b) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
  },

  PROFILE_DEN_VALUES: (state, action) => {
    const { payload } = action;
    state.den = payload;
  },

  PERSONALITY_RES: (state, action) => {
    const { payload } = action;
    state.personalityRes = payload;
  },
});
