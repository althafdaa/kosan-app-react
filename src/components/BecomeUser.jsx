import React from 'react';
import { Link } from 'react-router-dom';

const BecomeUser = () => {
  return (
    <div className='bg-green-600 px-4 py-2 mt-4 flex justify-between items-center text-green-50 rounded-lg'>
      <p>You have place to rent?</p>
      <Link
        to='/add-listing'
        className='border-2 px-2 py-1 border-white rounded-md hover:bg-green-700 hover:text-white'
      >
        Come In
      </Link>
    </div>
  );
};

export default BecomeUser;
