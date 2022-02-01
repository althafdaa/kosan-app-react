import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: '',
  login: {
    email: '',
    password: '',
  },
  isLogin: null,
  accCreated: null,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setEmail(state, action) {
      state.email = action.payload.email;
    },
    logInOnChange(state, action) {
      state.login.email = action.payload.email;
      state.login.password = action.payload.password;
    },
    isLogin(state, action) {
      state.isLogin = action.payload;
    },
    createAccount(state, action) {
      state.accCreated = action.payload;
    },
  },
});

export const { setEmail, logInOnChange, isLogin, createAccount } =
  formSlice.actions;

export default formSlice.reducer;
