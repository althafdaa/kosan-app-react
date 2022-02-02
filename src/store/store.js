import { configureStore } from '@reduxjs/toolkit';
import addListingSlice from './addListingSlice';
import formSlice from './formSlice';
import listingSlice from './listingSlice';
import uiSlice from './uiSlice';

const store = configureStore({
  reducer: {
    ui: uiSlice,
    form: formSlice,
    listing: listingSlice,
    add: addListingSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
