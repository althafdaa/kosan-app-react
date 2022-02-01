import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  listings: [],
  listing: {},
  discounted: [],
  profileListings: [],
  latestListing: {},
  isLoadingListings: true,
  isLoadingListing: true,
  isLoadingDiscounted: true,
  isLoadingProfile: true,
  isLoadingLatest: true,
};

const listingSlice = createSlice({
  name: 'listing',
  initialState,
  reducers: {
    listingsData(state, action) {
      state.listings = action.payload;
      state.isLoadingListings = false;
    },
    singleListing(state, action) {
      state.listing = action.payload;
      state.isLoadingListing = false;
    },
    discountedListing(state, action) {
      state.discounted = action.payload;
      state.isLoadingDiscounted = false;
    },
    profileListing(state, action) {
      state.profileListings = action.payload;
      state.isLoadingProfile = false;
    },
    latestListing(state, action) {
      state.latestListing = action.payload;
      state.isLoadingLatest = false;
    },
  },
});

export const {
  listingsData,
  singleListing,
  discountedListing,
  profileListing,
  latestListing,
} = listingSlice.actions;

export default listingSlice.reducer;
