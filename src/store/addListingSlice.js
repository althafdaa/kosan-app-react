import { createSlice } from '@reduxjs/toolkit';

const initialState = { isLoading: null, isAdded: null, uuid: '' };

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
  },
});

export const { addListingLoading, listingAdded } = addListingSlice.actions;

export default addListingSlice.reducer;
