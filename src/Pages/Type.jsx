import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import { useDispatch, useSelector } from 'react-redux';
import { getListingsData } from '../store/listingsAction';

const Type = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.listing.listings);
  const isLoading = useSelector((state) => state.listing.isLoadingListings);

  const params = useParams();

  useEffect(() => {
    dispatch(getListingsData(params.typeName));
  }, [dispatch, params.typeName]);

  return (
    <div className='py-4 px-6 grid gap-4'>
      <header>
        <h1 className='text-3xl font-bold'>
          {params.typeName === 'kosan' ? 'Kos-Kosan' : 'Apartement'}
        </h1>
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
                <label>Tunggu sebentar ya...!</label>
              </div>
            </div>
          </>
        ) : data && data.length > 0 ? (
          <>
            <ul>
              {data.map((listing) => (
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
          <p>There's nothing recently..</p>
        )}
      </main>
    </div>
  );
};

export default Type;
