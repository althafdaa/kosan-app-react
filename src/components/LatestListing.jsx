import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getLatestListing } from '../store/listingsAction';

const LatestListing = () => {
  const dispatch = useDispatch();
  const loadingListing = useSelector((state) => state.listing.isLoadingLatest);
  const latestListing = useSelector((state) => state.listing.latestListing);

  useEffect(() => {
    dispatch(getLatestListing());
  }, [dispatch]);

  const [onHover, setOnHover] = useState(false);
  const navigate = useNavigate();

  return loadingListing ? (
    <>
      <h1 className='text-2xl font-semibold mb-2'>Iklan Paling Baru</h1>{' '}
      <div className='shadow-xl rounded-lg h-52'>
        <div className='relative w-full h-full cursor-pointer bg-gray-300'></div>
      </div>
    </>
  ) : (
    <>
      <h1 className='text-2xl font-semibold mb-2'>Iklan Paling Baru</h1>{' '}
      <div className='shadow-xl rounded-lg h-52'>
        <div
          className='relative w-full h-full cursor-pointer'
          onClick={() =>
            navigate(`/type/${latestListing.type}/${latestListing.id}`)
          }
          onMouseEnter={() => setOnHover(true)}
          onMouseLeave={() => setOnHover(false)}
        >
          <img
            className='w-full h-full object-cover object-center rounded-lg'
            src={latestListing.imageUrls[0]}
            alt='latest'
          />

          {onHover && (
            <div className='absolute top-0 left-0 right-0 h-full hover:bg-black hover:opacity-50 rounded-lg duration-500 ease-in-out'></div>
          )}
          <p className='absolute bottom-16 left-5 font-bold bg-green-200 px-2 rounded-md shadow-lg'>
            {latestListing.name}
          </p>
          <p className='absolute bottom-8 left-5 font-bold bg-white px-2 rounded-md shadow-lg'>
            Rp
            {latestListing.offer
              ? latestListing.discountedPrice
                  .toString()
                  .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
              : latestListing.normalPrice
                  .toString()
                  .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')}
            / bulan
          </p>
        </div>
      </div>
    </>
  );
};

export default LatestListing;
