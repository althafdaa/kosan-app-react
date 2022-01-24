import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  collection,
  getDocs,
  where,
  orderBy,
  query,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import ListingItem from '../components/ListingItem';

const Type = () => {
  const [listings, setListings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    const fetch = async () => {
      try {
        const listingsRef = collection(db, 'listings');
        const q = query(
          listingsRef,
          where('type', '==', params.typeName),
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

        setListings(getListings);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetch();
  }, [params.typeName]);

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
          <p>There's nothing recently..</p>
        )}
      </main>
    </div>
  );
};

export default Type;
