import React from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaShower, FaTimesCircle } from 'react-icons/fa';

const ListingItem = ({ listing, id, deleteHandler }) => {
  return (
    <li className='border-b-2 mb-4 pb-4 relative object-contain'>
      {deleteHandler && (
        <button className=' absolute -top-4 right-0' onClick={deleteHandler}>
          <FaTimesCircle className='text-red-800 hover:text-red-900' />
        </button>
      )}

      <Link
        className='grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 justify-between md:px-12 lg:px-36 gap-4 items-center'
        to={`/type/${listing.type}/${id}`}
      >
        <div className='relative md:w-72 lg:w-52'>
          <p
            className={`absolute m-2 text-xs inline-block ${
              listing.type === 'kosan'
                ? 'bg-green-200 text-green-900'
                : 'bg-red-200 text-red-900'
            } rounded-lg py-1 px-2 shadow-md mb-1`}
          >
            Tipe: {listing.type === 'kosan' ? 'Kosan' : 'Apartemen'}
          </p>
          <img className='rounded-lg' src={listing.imageUrls[0]} alt='Kosan' />
        </div>

        <div className='flex flex-col'>
          <h3 className='font-semibold'>{listing.name}</h3>
          <p>{listing.location}</p>
          <div className='flex flex-col items-end'>
            {listing.offer && (
              <div className='flex gap-1 items-center'>
                <span className='font-bold text-sm text-red-600'>
                  HOT DEALS 🔥
                </span>
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
