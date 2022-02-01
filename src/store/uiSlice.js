import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showMyListings: false,
  personal: false,
  showPassword: false,
  isSubmitted: false,
  isCopied: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggle(state) {
      state.showMyListings = !state.showMyListings;
    },
    personalDetailsToggle(state) {
      state.personal = !state.personal;
    },
    showPassword(state) {
      state.showPassword = !state.showPassword;
    },
    isSubmitted(state) {
      state.isSubmitted = !state.isSubmitted;
    },
    shareCopied(state) {
      state.isCopied = !state.isCopied;
    },
  },
});

export const {
  toggle,
  personalDetailsToggle,
  showPassword,
  isSubmitted,
  shareCopied,
} = uiSlice.actions;

export default uiSlice.reducer;
