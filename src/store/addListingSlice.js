import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: null,
  isAdded: null,
  uuid: '',
  isEdited: null,
};

const addListingSlice = createSlice({
  name: 'add',
  initialState,
  reducers: {
    addListingLoading(state, action) {
      state.isLoading = action.payload;
    },
    listingAdded(state, action) {
      state.isAdded = action.payload.added;
      state.uuid = action.payload.uuid;
    },
    isLoading(state, action) {
      state.isLoading = action.payload;
    },
    isEdited(state, action) {
      state.isEdited = action.payload;
    },
    addSucceed(state, action) {
      state.isAdded = action.payload;
    },
  },
});

export const {
  addListingLoading,
  listingAdded,
  isLoading,
  isEdited,
  addSucceed,
} = addListingSlice.actions;

export default addListingSlice.reducer;
