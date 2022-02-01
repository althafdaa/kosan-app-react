import {
  listingsData,
  singleListing,
  discountedListing,
  profileListing,
  latestListing,
} from './listingSlice';
import { db } from '../firebase.config';
import {
  collection,
  getDocs,
  where,
  orderBy,
  query,
  limit,
  getDoc,
  doc,
} from 'firebase/firestore';

export const getListingsData = (params) => {
  return async (dispatch) => {
    const fetchData = async () => {
      try {
        const listingsRef = collection(db, 'listings');
        const q = query(
          listingsRef,
          where('type', '==', params),
          orderBy('timestamp', 'desc', limit(10))
        );

        const querySnap = await getDocs(q);

        const getListings = [];

        querySnap.forEach((data) => {
          return getListings.push({
            id: data.id,
            data: data.data(),
          });
        });

        dispatch(listingsData(getListings));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  };
};

export const getSingleListing = (params) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const docRef = doc(db, 'listings', params);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        dispatch(singleListing(docSnap.data()));
      }
    };

    fetchData();
  };
};

export const getDiscountedListing = () => {
  return async (dispatch) => {
    const fetchData = async () => {
      try {
        const listingsRef = collection(db, 'listings');
        const q = query(
          listingsRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc', limit(10))
        );

        const querySnap = await getDocs(q);

        const getListings = [];

        querySnap.forEach((data) => {
          return getListings.push({
            id: data.id,
            data: data.data(),
          });
        });

        dispatch(discountedListing(getListings));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  };
};

export const getprofileListing = (auth) => {
  return async (dispatch) => {
    const fetch = async () => {
      try {
        const listingsRef = collection(db, 'listings');
        const q = query(
          listingsRef,
          where('userRef', '==', auth),
          orderBy('timestamp', 'desc'),
          limit(10)
        );

        const querySnap = await getDocs(q);

        const getListings = [];

        querySnap.forEach((data) => {
          return getListings.push({
            id: data.id,
            data: data.data(),
          });
        });

        dispatch(profileListing(getListings));
      } catch (error) {
        console.log(error);
      }
    };

    fetch();
  };
};

export const getLatestListing = () => {
  return async (dispatch) => {
    const fetchListing = async () => {
      const collectionRef = collection(db, 'listings');
      const q = query(collectionRef, orderBy('timestamp', 'desc'), limit(1));
      const querySnap = await getDocs(q);

      querySnap.forEach((list) => {
        dispatch(
          latestListing({
            ...list.data(),
            id: list.id,
          })
        );
      });
    };
    fetchListing();
  };
};
