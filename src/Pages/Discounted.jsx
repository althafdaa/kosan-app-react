import React, { useEffect } from 'react';

import ListingItem from '../components/ListingItem';
import { useDispatch, useSelector } from 'react-redux';
import { getDiscountedListing } from '../store/listingsAction';

const Discounted = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.listing.isLoadingDiscounted);
  const listings = useSelector((state) => state.listing.discounted);

  useEffect(() => {
    dispatch(getDiscountedListing());
  }, [dispatch]);

  return (
    <div className='px-6 py-4 grid gap-4'>
      <header>
        <h1 className='text-3xl font-bold'>On Discount 🔥</h1>
      </header>

      <main className='flex flex-col'>
        {isLoading ? (
          <>
            <div className='alert alert-info mt-8'>
              <div className='flex-1'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  className='w-6 h-6 mx-2 stroke-current'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                  ></path>
                </svg>
                <label>... Loading please wait a second</label>
              </div>
            </div>
          </>
        ) : listings && listings.length > 0 ? (
          <>
            <ul>
              {listings.map((listing) => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                >
                  {listing.data.name}
                </ListingItem>
              ))}
            </ul>
          </>
        ) : (
          <p>There's no such a thing</p>
        )}
      </main>
    </div>
  );
};

export default Discounted;
