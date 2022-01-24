import React from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaShower, FaTimesCircle } from 'react-icons/fa';

const ListingItem = ({ listing, id }) => {
  return (
    <li className='border-b-2 pb-4 relative'>
      <button className=' absolute -top-4 right-0'>
        <FaTimesCircle className='text-red-800 hover:text-red-900' />
      </button>

      <Link
        className='flex justify-between md:justify-around gap-4'
        to={`/type/${listing.type}/${id}`}
      >
        <img
          className='w-24 md:w-80 rounded-lg object-cover'
          src={listing.imageUrls[0]}
          alt='Kosan'
        />

        <div className='flex flex-col'>
          <h3 className='font-semibold'>{listing.name}</h3>
          <p>{listing.location}</p>
          <div className='flex flex-col items-end'>
            {listing.offer && (
              <div className='flex gap-1'>
                <span className='font-bold text-red-600'>HOT DEALS 🔥</span>
                <p className='line-through'>
                  Rp
                  {listing.normalPrice
                    .toString()
                    .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')}
                </p>
              </div>
            )}
            <p className='font-bold text-green-600'>
              Rp
              {listing.offer
                ? listing.discountedPrice
                    .toString()
                    .replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1.')
                : listing.normalPrice}
              /months
            </p>
          </div>
          <div className='flex justify-between'>
            <FaBed />
            <p className='text-sm font-semibold'>
              {listing.furnished ? 'Fully Furnished' : 'No Furnish'}
            </p>
          </div>
          <div className='flex justify-between'>
            <FaShower />
            <p className='text-sm font-semibold'>
              Bathroom
              {listing.bathroom ? ' Inside' : ' Outside'}
            </p>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default ListingItem;
